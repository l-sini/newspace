import {
  Dialog,
  IconButton,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from '@mui/material';
import axios, { AxiosError } from 'axios';
import React, { useEffect, useState } from 'react';
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import ArrowCircleRightOutlinedIcon from '@mui/icons-material/ArrowCircleRightOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';

interface Props {}

interface RenderPhoto {
  _id: string;
  id?: number;
}

export const Home: React.FC<Props> = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [select, setSelect] = useState<RenderPhoto>();
  const [photos, setPhotos] = useState<RenderPhoto[]>([]);
  useEffect(() => {
    axios
      .get(
        'https://s3.us-west-2.amazonaws.com/secure.notion-static.com/a7804447-abeb-473e-be8b-8025c4f624f6/test.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20220321%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20220321T121400Z&X-Amz-Expires=86400&X-Amz-Signature=9aea90cc35f8bd4e1cada970fa8d38ee5121019ac0988824640063843eeec59c&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22test.json%22&x-id=GetObject'
      )
      .then((res) => {
        console.log('res>>>', res.data.renderings);
        setPhotos(res.data.renderings);
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <ImageList
        cols={5}
        gap={7}
        style={{ border: '1px double green', padding: '1em' }}
      >
        {photos.map((photo: RenderPhoto, idx: number) => (
          <ImageListItem
            key={idx.toString()}
            aria-hidden='true'
            onClick={() => {
              setOpen(true);
              const q = photo;
              q.id = idx + 1;
              setSelect(q);
            }}
          >
            <img
              src={photo._id}
              alt={idx.toString()}
              style={{ borderRadius: '10px' }}
            />
            <ImageListItemBar
              position='below'
              title={`${idx + 1}번째 사진`}
              style={{
                marginTop: '-.4em',
                color: 'grey',
                textAlign: 'center',
              }}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Dialog fullScreen open={open} onClose={() => setOpen(false)}>
        <h2 style={{ textAlign: 'center' }}>{select?.id}번째 사진</h2>
        <div style={{ textAlign: 'right', margin: '-2.5em 1em 1em 0' }}>
          <IconButton size='small' onClick={() => setOpen(false)}>
            <ClearOutlinedIcon sx={{ color: '#F50057', fontSize: '1.5em' }} />
          </IconButton>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            onClick={() => {
              const id = photos.findIndex((q) => q._id === select?._id);
              if (id === 1) {
                const last = photos.length - 1;
                const newSelect = photos[last];
                newSelect.id = last + 1;
                setSelect(newSelect);
              } else {
                const newSelect = photos[id - 1];
                newSelect.id = id;
                setSelect(newSelect);
              }
            }}
          >
            <ArrowCircleLeftOutlinedIcon
              color='action'
              sx={{ fontSize: '2.5em' }}
            />
          </IconButton>
          <img src={select?._id} alt={select?._id} style={{ width: '75vw' }} />
          <IconButton
            onClick={() => {
              const id = photos.findIndex((q) => q._id === select?._id);
              if (id === photos.length - 1) {
                const newSelect = photos[0];
                newSelect.id = 1;
                setSelect(newSelect);
              } else {
                const newSelect = photos[id + 1];
                newSelect.id = id + 2;
                setSelect(newSelect);
              }
            }}
          >
            <ArrowCircleRightOutlinedIcon
              color='action'
              sx={{ fontSize: '2.5em' }}
            />
          </IconButton>
        </div>
      </Dialog>
    </>
  );
};
