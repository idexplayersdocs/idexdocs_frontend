import moment from "moment";
import Subtitle from "../Subtitle";

export default function Characteristics({dataList, labelList}: any) {
  return(
    <>
    <div className="w-100 mt-3" style={{maxHeight: '300px', overflow: 'auto'}}>
      <table className="table table-striped">
        <thead>
          <tr>
            {labelList.fisico.map((label: any, index: number) => (
              <th key={index} className="table-dark text-center">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataList && dataList.fisico && dataList.fisico.length > 0 ? (
            dataList.fisico.map((data: any, index: number) => {
              const reorderedKeys = ['data_avaliacao', ...Object.keys(data).filter(key => key !== 'data_avaliacao' && key !== 'sum' && key !== 'mean'), 'sum', 'mean'];
              return (
                <tr key={index}>
                  {reorderedKeys.map((key: string, idx: number) => (
                    <td key={idx} className="table-dark text-center">
                      {/* {key === 'data_avaliacao' ? moment(data[key]).format('DD/MM/YYYY') : data[key]} */}
                      {key === 'data_avaliacao' ? moment(data[key]).format('DD/MM/YYYY') 
                        : key === 'mean' ? parseFloat(data[key]).toFixed(2) 
                        : data[key]
                      }
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={Object.keys(labelList.fisico).length} className="table-dark text-center">
                Lista vazia
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <div className="mt-3 w-100">
      <Subtitle subtitle='Perfil Técnico Diferencial' />
    </div>
    <div className="w-100 mt-3" style={{maxHeight: '300px', overflow: 'auto'}}>
      <table className="table table-striped">
        <thead>
          <tr>
            {labelList.tecnico.map((label: any, index: number) => (
              <th key={index} className="table-dark text-center">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataList && dataList.tecnico && dataList.tecnico.length > 0 ? (
            dataList.tecnico.map((data: any, index: number) => {
              const reorderedKeys = ['data_avaliacao', ...Object.keys(data).filter(key => key !== 'data_avaliacao' && key !== 'sum' && key !== 'mean'), 'sum', 'mean'];
              return (
                <tr key={index}>
                  {reorderedKeys.map((key: string, idx: number) => (
                    <td key={idx} className="table-dark text-center">
                      {/* {key === 'data_avaliacao' ? moment(data[key]).format('DD/MM/YYYY') : data[key]} */}
                      {key === 'data_avaliacao' ? moment(data[key]).format('DD/MM/YYYY') 
                        : key === 'mean' ? parseFloat(data[key]).toFixed(2) 
                        : data[key]
                      }
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={Object.keys(labelList.tecnico).length} className="table-dark text-center">
                Lista vazia
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    <div className="mt-3 w-100">
      <Subtitle subtitle='Perfil Psicológico' />
    </div>
    <div className="w-100 mt-3" style={{maxHeight: '300px', overflow: 'auto'}}>
      <table className="table table-striped">
        <thead>
          <tr>
            {labelList.psicologico.map((label: any, index: number) => (
              <th key={index} className="table-dark text-center">{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataList && dataList.psicologico && dataList.psicologico.length > 0 ? (
            dataList.psicologico.map((data: any, index: number) => {
              const reorderedKeys = ['data_avaliacao', ...Object.keys(data).filter(key => key !== 'data_avaliacao' && key !== 'sum' && key !== 'mean'), 'sum', 'mean'];
              return (
                <tr key={index}>
                  {reorderedKeys.map((key: string, idx: number) => (
                    <td key={idx} className="table-dark text-center">
                      {/* {key === 'data_avaliacao' ? moment(data[key]).format('DD/MM/YYYY') : data[key]} */}
                      {key === 'data_avaliacao' ? moment(data[key]).format('DD/MM/YYYY') 
                        : key === 'mean' ? parseFloat(data[key]).toFixed(2) 
                        : data[key]
                      }
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={Object.keys(labelList.tecnico).length} className="table-dark text-center">
                Lista vazia
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      <div className="mt-5 align-self-start media-das-medias" style={{maxHeight: '300px', overflow: 'auto'}}>
          <table className="table table-striped">
            <thead>
              <tr>
                <th className="table-dark text-center">Data</th>
                <th className="table-dark text-center">Média Geral</th>
              </tr>
            </thead>
            <tbody>
            {dataList && dataList.total_mean && Object.keys(dataList.total_mean).length > 0 ? (
              Object.entries(dataList.total_mean).map(([key, value], index) => (
                <tr key={index}>
                  <td className="table-dark text-center">{moment(key).format('DD/MM/YYYY')}</td>
                  <td className="table-dark text-center">{value as number}</td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan={2} className="table-dark text-center">
                    Lista vazia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
    </div>
    </>
  )
}
