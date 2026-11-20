# assets

## source.mp4

The five moments of Rockstar Games' Grand Theft Auto VI Trailer 2
(6 May 2025, https://www.youtube.com/watch?v=VQRLujxTm3c) that the clip
is cut from, in clip order, trimmed and joined with ffmpeg (letterbox
cropped, 1280x540, 30 fps). The full trailer (1920x1080, 2:47) was
fetched from the Internet Archive's preservation copy of that same
official upload (archive.org item `youtube-VQRLujxTm3c`, file
`20250506 - Grand Theft Auto VI Trailer 2 [VQRLujxTm3c].mp4`,
63,118,955 bytes, md5 e15695c4792a76489a4ad80ab7846e7a).

| Clip time | Trailer 2 time | What it shows |
| --- | --- | --- |
| 0:00–0:07 | 1:01–1:08 | Lucia walks out of the prison gate to Jason; close-up at 1:06 |
| 0:07–0:11 | 1:24–1:28 | Sunset pier in the Leonida Keys |
| 0:11–0:15 | 1:32–1:36 | Jason and Lucia at a beach bar |
| 0:15–0:21 | 1:40–1:46 | Vice City nightclub crowd |
| 0:21–0:25 | 1:52–1:56 | Real Dimez on the street at golden hour |

Moments deliberately left out: the dark scene around 1:18 and the
heist interior around 1:48, which do not read well in a vertical Short.

## DejaVuSans-Bold.ttf

The font the clip's on-screen text is drawn with. DejaVu fonts are
freely licensed (see https://dejavu-fonts.github.io/).

## The rendered clip

`main.ts` renders `assets/source.mp4` into the 1080x1920 vertical clip
(blurred-fill background, hook and pitch text on screen). The finished
Short that is uploaded to YouTube lives outside this repository at
`clip/gta6-clip-vertical.mp4` in the build workspace.
