import styles from "../styles/SoccerField.module.css";

export default function SoccerField({ athleteData }: any) {

  const getClassName = (posicao: any) => {
    switch (posicao) {
      case 2:
        return styles.goleiro;
      case 3:
        return styles.lateral_direito;
      case 4:
        return styles.lateral_esquerdo;
      case 5:
        return styles.zagueiro;
      case 6:
        return styles.volante;
      case 7:
        return styles.meia_armador;
      case 8:
        return styles.meia_atacante;
      case 9:
        return styles.atacante;
      case 10:
        return styles.centroavante;
      case 11:
        return styles.extremo_direito;
      case 12:
        return styles.extremo_esquerdo;
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
