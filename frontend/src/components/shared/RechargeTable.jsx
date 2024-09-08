import moment from "moment";

export const RechargeTable = ({ data, currentPage, limit }) => {
  return (
    <>
      <div className="bg-transparent text-white">
        <table className="w-full text-center border-collapse">
          <thead className="sticky top-0 bg-[#121315]">
            <tr className="text-[#A5A5A5] h-12 border-b border-[#373737]">
              <th className="p-2 font-normal">SL No’s</th>
              <th className="p-2 font-normal">Transaction ID</th>
              <th className="p-2 font-normal">Amount</th>
              <th className="p-2 font-normal">Payment Type</th>
              <th className="p-2 font-normal">Date & Time</th>
              <th className="p-2 font-normal">Status</th>
            </tr>
          </thead>

          <tbody>
            {data.map((history, index) => (
              <tr key={index} className="h-12 border-b border-[#373737]">
                <td className="p-2 font-normal text-sm">
                  {(currentPage - 1) * limit + index + 1}
                </td>
                <td className="p-2 font-normal text-sm">
                  {history.transaction_id}
                </td>
                <td className="p-2 font-normal text-sm">{history.amount}</td>
                <td className="p-2 font-normal text-sm">
                  {history.payment_type}
                </td>
                <td className="p-2 font-normal text-sm">
                  {moment(history.date_time, "MM/DD/YYYYThh:mm:ss A").format(
                    "DD/MM/YYYY hh:mm:ss A"
                  )}
                </td>
                <td className="p-2 font-normal text-sm text-teal-400">
                  {history.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export const RechargeTabelMob = ({ data, currentPage, limit }) => {
  const wrapStyle = {
    wordBreak: "break-word",
    whiteSpace: "normal",
    overflowWrap: "break-word",
  };

  return (
    <>
      {data.map((item, index) => (
        <div
          key={index}
          className="my-[1.5rem] w-full border-[10px] border-[#444444] rounded-lg"
        >
          <table className="w-full table-auto text-xs">
            <tbody>
              <tr>
                <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                  SL No
                </td>
                <td
                  className="border-b-2 border-[#949494] p-3"
                  style={wrapStyle}
                >
                  {(currentPage - 1) * limit + index + 1}
                </td>
              </tr>
              <tr>
                <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                  Transaction ID
                </td>
                <td
                  className="border-b-2 border-[#949494] p-3"
                  style={wrapStyle}
                >
                  {item.transaction_id}
                </td>
              </tr>
              <tr>
                <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                  Amount
                </td>
                <td
                  className="border-b-2 border-[#949494] p-3"
                  style={wrapStyle}
                >
                  {item.amount}
                </td>
              </tr>
              <tr>
                <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                  Payment Type
                </td>
                <td
                  className="border-b-2 border-[#949494] p-3"
                  style={wrapStyle}
                >
                  {item.payment_type}
                </td>
              </tr>
              <tr>
                <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                  Date & Time
                </td>
                <td
                  className="border-b-2 border-[#949494] p-3"
                  style={wrapStyle}
                >
                  {moment(item.date_time, "MM/DD/YYYYThh:mm:ss A").format(
                    "DD/MM/YYYY hh:mm:ss A"
                  )}
                </td>
              </tr>
              <tr>
                <td className="p-3 px-5 text-[#959595]">Status</td>
                <td className="p-3" style={wrapStyle}>
                  {item.status}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
};
