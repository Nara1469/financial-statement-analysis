import { Container, Table } from "react-bootstrap";

export const PortfolioTable = ({ tableData }) => {
  return (
    <Container fluid>
      <Table className="table">
        <tbody slot="body">
          {tableData.map((company, i) => (
            <>
              <tr>
                <th>Symbol</th>
                <td>{company.ticker}</td>
              </tr>
              <tr>
                <th>Price</th>
                <td>{company.price}</td>
              </tr>
              <tr>
                <th>Beta</th>
                <td>{company.beta}</td>
              </tr>
              <tr>
                <th>Market Cap</th> <td>{company.mktCap}</td>
              </tr>
              <tr>
                <th>Change</th> <td>{company.changes}</td>
              </tr>
              <tr>
                <th>52 Week Range</th> <td>{company.range}</td>
              </tr>
            </>
          ))}
        </tbody>
      </Table>

      <Table className="table">
        <tbody slot="body">
          {tableData.map((company, i) => (
            <>
              <tr>
                <th>Return on Equity(ROE) -TTM</th>
                <td>{company.returnOnEquityTTM}</td>
              </tr>
              <tr>
                <th>Return on Assets (ROA) - TTM</th>
                <td>{company.returnOnAssetsTTM}</td>
              </tr>
              <tr>
                <th>Operating Margin - TTM</th>
                <td>{company.operatingProfitMarginTTM}</td>
              </tr>
              <tr>
                <th>Debt/Equity - TTM</th>
                <td>{company.debtEquityRatioTTM}</td>
              </tr>
              <tr>
                <th>P/E -TTM</th>
                <td>{company.peRatioTTM}</td>
              </tr>
              <tr>
                <th>P/B - TTM</th>
                <td>{company.priceBookValueRatioTTM}</td>
              </tr>
            </>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};
