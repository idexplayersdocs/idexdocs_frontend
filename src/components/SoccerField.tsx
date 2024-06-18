import styles from "../styles/SoccerField.module.css";

export default function SoccerField({ athleteData }: any) {

  const getClassName = (posicao: string) => {
    switch (posicao) {
      case 'Goleiro':
        return styles.goleiro;
      case 'Lateral direito':
        return styles.lateral_direito;
      case 'Lateral esquerdo':
        return styles.lateral_esquerdo;
      case 'Zagueiro':
        return styles.zagueiro;
      case 'Volante':
        return styles.volante;
      case 'Meia armador':
        return styles.meia_armador;
      case 'Meia atacante':
        return styles.meia_atacante;
      case 'Atacante':
        return styles.atacante;
      case 'Centroavante':
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
