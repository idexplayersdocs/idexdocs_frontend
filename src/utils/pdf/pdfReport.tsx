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

export const getYouTubeThumbnail = (url: string): string => {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match
    ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`
    : "https://via.placeholder.com/200x112?text=No+Thumbnail";
};

export const createRows = <T,>(items: T[] = [], itemsPerRow: number): T[][] => {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += itemsPerRow) {
    rows.push(items.slice(i, i + itemsPerRow));
  }
  return rows;
};
