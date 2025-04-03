export const getPositionName = (posicao: number): string => {
  switch (posicao) {
    case 2:
      return "goleiro";
    case 3:
      return "lateral_direito";
    case 4:
      return "lateral_esquerdo";
    case 5:
      return "zagueiro";
    case 6:
      return "volante";
    case 7:
      return "meia_armador";
    case 8:
      return "meia_atacante";
    case 9:
      return "atacante";
    case 10:
      return "centroavante";
    default:
      return "";
  }
};

export const getThumbnail = (url: string): string => {
  const youtubeRegex = /(?:youtube\.com\/(?:embed\/|watch\?v=)|youtu\.be\/)([\w-]+)/;
  const match = url.match(youtubeRegex);

  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : "/images/download.jpg";
};

export const createRows = <T,>(items: T[] = [], itemsPerRow: number): T[][] => {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += itemsPerRow) {
    rows.push(items.slice(i, i + itemsPerRow));
  }
  return rows;
};