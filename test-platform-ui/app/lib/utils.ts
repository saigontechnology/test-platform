export const calc_image_size_base64 = (image: string) => {
  let y = 1;
  if (image.endsWith('==')) {
    y = 2;
  }
  const x_size = image.length * (3 / 4) - y;
  return Math.round(x_size / 1024 / 1024);
};

export const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export const resize_base64 = async (
  base64: string,
  opts: { width: number } = { width: 450 },
) =>
  await new Promise((resolve) => {
    const MAX_WIDTH = opts.width;
    let img = new Image();
    img.src = base64;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ratio = MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;
      canvas.height = img.height * ratio;
      const context = canvas.getContext('2d');
      context?.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL());
    };
  });

export const getClientSideCookie = (name: string): string | undefined => {
  console.log('getClientSideCookie cookie: ', document.cookie);
  const cookieValue = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`))
    ?.split('=')[1];

  return cookieValue;
};
