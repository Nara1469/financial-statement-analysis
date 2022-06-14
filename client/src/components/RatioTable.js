import { Container, Table } from 'react-bootstrap';

export const RatioTable = ({ tableData, ratioChoice }) => {
  return (
    <Container fluid className='add-space'>
      <h5>{ratioChoice}: (in Numbers)</h5>
      <Table responsive="sm">
        <thead>
          <tr>
            <th>#</th>
            <th>Company</th>
            <th>2017</th>
            <th>2018</th>
            <th>2019</th>
            <th>2020</th>
            <th>2021</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((company, i) => (
            <tr key={`table-${i}-${ratioChoice}`}>
              <td>{i + 1}</td>
              <td>{company.ticker}</td>
              <td step='0.0001'>{company.year1}</td>
              <td>{company.year2}</td>
              <td>{company.year3}</td>
              <td>{company.year4}</td>
              <td>{company.year5}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
