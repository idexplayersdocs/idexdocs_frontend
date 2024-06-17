import styles from "../styles/SoccerField.module.css";

export default function SoccerField({ athleteData }: any) {

  const getClassName = (posicao: string) => {
    switch (posicao) {
      case 'goleiro':
        return styles.goleiro;
      case 'lateral direito':
        return styles.lateral_direito;
      case 'lateral esquerdo':
        return styles.lateral_esquerdo;
      case 'zagueiro':
        return styles.zagueiro;
      case 'volante':
        return styles.volante;
      case 'meia armador':
        return styles.meia_armador;
      case 'meia atacante':
        return styles.meia_atacante;
      case 'atacante':
        return styles.atacante;
      case 'centroavante':
        return styles.centroavante;
      default:
        return '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.field}>
        {athleteData.posicao_primaria && (
          <div className={getClassName(athleteData.posicao_primaria)}></div>
        )}
        {athleteData.posicao_secundaria && (
          <div className={getClassName(athleteData.posicao_secundaria)}></div>
        )}
        {athleteData.posicao_terciaria && (
          <div className={getClassName(athleteData.posicao_terciaria)}></div>
        )}
      </div>
    </div>
  );
}
