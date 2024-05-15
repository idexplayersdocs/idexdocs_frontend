import styles from "../styles/SoccerField.module.css";

export default function SoccerField({ athleteData }: any) {

  const getClassName = (posicao: string) => {
    switch (posicao) {
      case 'goleiro':
        return styles.goleiro;
      case 'zagueiro':
        return styles.zagueiro;
      case 'lateral':
        return styles.lateral;
      case 'volante':
        return styles.volante;
      case 'meia':
        return styles.meia;
      case 'atacante':
        return styles.atacante;
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
