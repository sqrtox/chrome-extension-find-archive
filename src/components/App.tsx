import { ThemeProvider, createTheme } from '@mui/material/styles';
import ScopedCssBaseline from '@mui/material/ScopedCssBaseline';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { useEffect, useRef, useState } from 'react';

export default function App() {
  const [state, setState] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const theme = createTheme({
    palette: {
      mode: 'dark'
    }
  });

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    document.body.style.marginTop = `${ref.current.offsetHeight}px`;

    return () => {
      document.body.style.marginTop = '';
    };
  }, [ref.current]);

  return (
    <ThemeProvider theme={theme}>
      <ScopedCssBaseline />
      <Stack
        ref={ref}
        width='calc(100% - 2rem)'
        bgcolor='background.paper'
        position='fixed'
        zIndex='999999'
        top='0'
        left='0'
        padding='1rem'
        justifyContent='space-between'
        alignItems='center'
        direction='row'
      >
        {state === 0 && (
          <>
            <Typography color='text.primary' fontSize='small'>保存されたアーカイブを探しますか？</Typography>
            <Button
              size='small'
              variant='contained'
              onClick={async () => {
                setState(1);

                try {
                  const res = await chrome.runtime.sendMessage({
                    type: 'findArchive'
                  });

                  if (!res) {
                    setState(3);

                    return;
                  }

                  setState(4);

                  await chrome.runtime.sendMessage({
                    type: 'redirectToArchive',
                    archiveUrl: res
                  });
                } catch {
                  setState(2);
                }
              }}>探す</Button>
          </>
        )}
        {state === 1 && <Typography color='text.primary' fontSize='small'>保存されたアーカイブを探しています……</Typography>}
        {state === 2 && <Typography color='text.primary' fontSize='small'>アーカイブの取得に失敗しました</Typography>}
        {state === 3 && <Typography color='text.primary' fontSize='small'>利用可能なアーカイブはありません</Typography>}
        {state === 4 && <Typography color='text.primary' fontSize='small'>利用可能なアーカイブが見つかりました</Typography>}
      </Stack>
    </ThemeProvider>
  );
}
