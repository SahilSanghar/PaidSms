import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/Button";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "@/utils/AppContext";
import {
  RechargeTabelMob,
  RechargeTable,
} from "@/components/shared/RechargeTable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import moment from "moment";

const History = () => {
  const [selectedTabs, setSelectedTabs] = useState(true); // true for recharge, false for transaction
  const [rechargeHistory, setRechargeHistory] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const { user } = useContext(AuthContext);
  const userId = user.userId;

  // State for pagination
  const [rechargeLimit, setRechargeLimit] = useState(10);
  const [rechargeCurrentPage, setRechargeCurrentPage] = useState(1);
  const [transactionLimit, setTransactionLimit] = useState(10);
  const [transactionCurrentPage, setTransactionCurrentPage] = useState(1);

  const [tranFilter, setTranFilter] = useState("All");

  console.log(tranFilter);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const [rechargeResponse, transactionResponse] = await Promise.all([
          axios.get(`/recharge-history?userId=${userId}`),
          axios.get(`/transaction-history?userId=${userId}`),
        ]);

        setRechargeHistory(rechargeResponse.data || []); // Ensure it's an array
        setTransactionHistory(transactionResponse.data || []); // Ensure it's an array
      } catch (error) {
        toast.error("Failed to fetch history data");
      }
    };

    fetchHistory();
  }, [userId]);

  // Filter and group transaction history data
  const filterTransactionHistory = (data) => {
    if (!Array.isArray(data)) {
      return [];
    }

    const groupedData = data.reduce((acc, entry) => {
      if (!acc[entry.id]) {
        acc[entry.id] = [];
      }
      acc[entry.id].push(entry);
      return acc;
    }, {});

    const preparedData = Object.values(groupedData).map((entries) => {
      const finishedEntries = entries.filter(
        (entry) => entry.status === "FINISHED"
      );
      const cancelledEntries = entries.filter(
        (entry) => entry.status === "CANCELLED"
      );

      const displayEntry =
        cancelledEntries.length > 0
          ? cancelledEntries[0]
          : finishedEntries.find((entry) => entry.otp !== null) ||
            finishedEntries[0];

      return {
        ...displayEntry,
        otps:
          finishedEntries
            .filter((entry) => entry.otp)
            .map((entry) => entry.otp)
            .join(`<br><br>`) || "-",
      };
    });

    return preparedData;
  };

  let filteredTransactionHistory = filterTransactionHistory(transactionHistory);

  if (tranFilter === "Success") {
    filteredTransactionHistory = filteredTransactionHistory.filter(
      (entry) => entry.status === "FINISHED"
    );
  } else if (tranFilter === "Cancelled") {
    filteredTransactionHistory = filteredTransactionHistory.filter(
      (entry) => entry.status === "CANCELLED"
    );
  }

  // Sort transactions by date and time
  const sortedFilteredTransactionHistory = filteredTransactionHistory
    .sort((a, b) =>
      moment(b.date_time, "MM/DD/YYYYTHH:mm:ss A").isBefore(
        moment(a.date_time, "MM/DD/YYYYTHH:mm:ss A")
      )
        ? 1
        : -1
    )
    .reverse();

  // Pagination handlers for Recharge History
  const handleRechargeLimitChange = (value) => {
    setRechargeLimit(Number(value));
    setRechargeCurrentPage(1); // Reset to the first page when limit changes
  };

  const handleRechargeNextPage = () => {
    if (rechargeCurrentPage * rechargeLimit < rechargeHistory.length) {
      setRechargeCurrentPage(rechargeCurrentPage + 1);
    }
  };

  const handleRechargePrevPage = () => {
    if (rechargeCurrentPage > 1) {
      setRechargeCurrentPage(rechargeCurrentPage - 1);
    }
  };

  // Pagination handlers for Transaction History
  const handleTransactionLimitChange = (value) => {
    setTransactionLimit(Number(value));
    setTransactionCurrentPage(1); // Reset to the first page when limit changes
  };

  const handleTransactionNextPage = () => {
    if (
      transactionCurrentPage * transactionLimit <
      sortedFilteredTransactionHistory.length
    ) {
      setTransactionCurrentPage(transactionCurrentPage + 1);
    }
  };

  const handleTransactionPrevPage = () => {
    if (transactionCurrentPage > 1) {
      setTransactionCurrentPage(transactionCurrentPage - 1);
    }
  };

  // Slice data for current page
  const startIndexRecharge = (rechargeCurrentPage - 1) * rechargeLimit;
  const startIndexTransaction = (transactionCurrentPage - 1) * transactionLimit;

  const rechargeData = Array.isArray(rechargeHistory)
    ? rechargeHistory.slice(
        startIndexRecharge,
        startIndexRecharge + rechargeLimit
      )
    : [];
  const transactionData = Array.isArray(sortedFilteredTransactionHistory)
    ? sortedFilteredTransactionHistory.slice(
        startIndexTransaction,
        startIndexTransaction + transactionLimit
      )
    : [];

  const filteredData = selectedTabs ? rechargeData : transactionData;

  // Get date range
  const getDateRange = (data) => {
    if (data.length === 0) return "No data available";
    const dates = data.map((entry) =>
      moment(entry.date_time, "MM/DD/YYYYTHH:mm:ss A")
    );
    const minDate = moment.min(dates);
    const maxDate = moment.max(dates);
    return `${minDate.format("DD/MM/YY")} - ${maxDate.format("DD/MM/YY")}`;
  };

  return (
    <div>
      <div className="bg-[#121315] h-[calc(100dvh-6rem)] flex flex-col overflow-y-auto w-full p-4 md:p-6 rounded-lg mb-[30px] border-none dark relative">
        <div className="flex flex-col md:flex-row items-center justify-between mb-2 md:mb-5">
          <div className="flex items-center h-auto">
            <div
              className={`mr-5 text-sm md:text-base  md:mr-8 cursor-pointer ${
                selectedTabs
                  ? "underline underline-offset-2 text-primary"
                  : "text-[#A5A5A5]"
              }`}
              onClick={() => setSelectedTabs(true)}
            >
              Recharge History
            </div>
            <div
              className={`cursor-pointer text-sm md:text-base ${
                !selectedTabs
                  ? "underline  underline-offset-2 text-primary"
                  : "text-[#A5A5A5]"
              }`}
              onClick={() => setSelectedTabs(false)}
            >
              Number History
            </div>
          </div>
          {!selectedTabs && (
            <div className="flex items-center gap-4">
              <Filter setTranFilter={setTranFilter} transFilter={tranFilter} />
              <p className="min-w-fit text-sm">
                Total: {filteredTransactionHistory.length}
              </p>
            </div>
          )}
          <div className="flex items-center gap-4">
            <Limiter
              limit={selectedTabs ? rechargeLimit : transactionLimit}
              onLimitChange={(value) =>
                selectedTabs
                  ? handleRechargeLimitChange(value)
                  : handleTransactionLimitChange(value)
              }
            />
            <p className="text-[#A5A5A5] text-sm">
              Data:{" "}
              <span className="text-white font-normal text-xs">
                {getDateRange(selectedTabs ? rechargeData : transactionData)}
              </span>
            </p>
          </div>
        </div>
        <hr className="border-t border-[#373737]" />

        <div className="h-[calc(100%-100px)] overflow-y-auto hide-scrollbar relative">
          {selectedTabs ? (
            rechargeHistory.length > 0 ? (
              <>
                <div className="hidden md:block">
                  <RechargeTable
                    data={rechargeData}
                    currentPage={rechargeCurrentPage}
                    limit={rechargeLimit}
                  />
                </div>
                <div className="block md:hidden">
                  <RechargeTabelMob
                    data={rechargeData}
                    currentPage={rechargeCurrentPage}
                    limit={rechargeLimit}
                  />
                </div>
              </>
            ) : (
              <div className="text-white text-center h-full flex items-center justify-center">
                No history available
              </div>
            )
          ) : transactionHistory.length > 0 ? (
            <>
              <div className="hidden md:block">
                <NumberTable
                  data={transactionData}
                  currentPage={transactionCurrentPage}
                  limit={transactionLimit}
                />
              </div>
              <div className="block md:hidden">
                <NumberTabelMob
                  data={transactionData}
                  currentPage={transactionCurrentPage}
                  limit={transactionLimit}
                />
              </div>
            </>
          ) : (
            <div className="text-center h-full flex items-center justify-center">
              No history available
            </div>
          )}
        </div>

        {/* Pagination controls */}
        {filteredData.length > 0 && (
          <div className="flex items-center justify-center gap-4 bg-[#121315] pt-4">
            {selectedTabs ? (
              <>
                <Button
                  className="py-1 px-6 text-xs w-20 h-8 !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
                  onClick={handleRechargePrevPage}
                  disabled={rechargeCurrentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  className="py-1 px-6 text-xs w-20 h-8 !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
                  onClick={handleRechargeNextPage}
                  disabled={
                    rechargeCurrentPage * rechargeLimit >=
                    rechargeHistory.length
                  }
                >
                  Next
                </Button>
              </>
            ) : (
              <>
                <Button
                  className="py-1 px-6 text-xs w-20 h-8 !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
                  onClick={handleTransactionPrevPage}
                  disabled={transactionCurrentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  className="py-1 px-6 text-xs w-20 h-8 !rounded-md border-2 border-white font-normal hover:!bg-white hover:text-black transition-colors duration-200 ease-in-out"
                  onClick={handleTransactionNextPage}
                  disabled={
                    transactionCurrentPage * transactionLimit >=
                    filteredTransactionHistory.length
                  }
                >
                  Next
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
const statusMap = {
  CANCELLED: "REFUNDED",
  FINISHED: "FINISHED",
};
const wrapStyle = {
  wordBreak: "break-word",
  whiteSpace: "normal",
  overflowWrap: "break-word",
};
const NumberTable = ({ data, currentPage, limit }) => {
  return (
    <div className="bg-transparent text-white relative">
      <table className="w-full text-center border-collapse">
        <thead className="sticky top-0 bg-[#121315]">
          <tr className="text-[#A5A5A5] h-12 border-b border-[#373737]">
            <th className="p-2 font-normal">SL No’s</th>
            <th className="p-2 font-normal">ID</th>
            <th className="p-2 font-normal">Number</th>
            <th className="p-2 font-normal">OTP</th>
            <th className="p-2 font-normal">Date & Time</th>
            <th className="p-2 font-normal">Service</th>
            <th className="p-2 font-normal">Server</th>
            <th className="p-2 font-normal">Price</th>
            <th className="p-2 font-normal">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry, index) => (
            <tr key={index} className="h-12 border-b border-[#373737]">
              <td className="p-2 font-normal text-sm">
                {(currentPage - 1) * limit + index + 1}
              </td>
              <td className="p-2 font-normal text-sm">{entry.id}</td>
              <td className="p-2 font-normal text-sm">{entry.number}</td>
              <td
                className="p-2 font-normal text-sm max-w-[400px]"
                style={wrapStyle}
              >
                <span dangerouslySetInnerHTML={{ __html: entry.otps }} />
              </td>
              <td className="p-2 font-normal text-sm">
                {moment(entry.date_time, "MM/DD/YYYYTHH:mm:ss A").format(
                  "DD/MM/YYYY hh:mm:ss A"
                )}
              </td>
              <td className="p-2 font-normal text-sm">{entry.service}</td>
              <td className="p-2 font-normal text-sm">{entry.server}</td>
              <td className="p-2 font-normal text-sm">{entry.price}</td>
              <td className="p-2 font-normal text-sm text-teal-400">
                {statusMap[entry.status] || ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Limiter = ({ limit, onLimitChange }) => {
  return (
    <Select value={String(limit)} onValueChange={onLimitChange}>
      <SelectTrigger className="w-[80px] dark bg-transparent">
        <SelectValue>{limit}</SelectValue>
      </SelectTrigger>
      <SelectContent className="dark bg-[#1e1e1e]">
        <SelectGroup>
          <SelectLabel className="font-normal">Limit</SelectLabel>
          <SelectItem value="10">10</SelectItem>
          <SelectItem value="20">20</SelectItem>
          <SelectItem value="30">30</SelectItem>
          <SelectItem value="50">50</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
const Filter = ({ transFilter, setTranFilter }) => {
  return (
    <Select value={transFilter} onValueChange={(value) => setTranFilter(value)}>
      <SelectTrigger className="dark bg-transparent">
        <SelectValue>{transFilter}</SelectValue>
      </SelectTrigger>
      <SelectContent className="dark bg-[#1e1e1e]">
        <SelectGroup>
          <SelectLabel className="font-normal">Filter</SelectLabel>
          <SelectItem value="All">All</SelectItem>
          <SelectItem value="Success">Success</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

const NumberTabelMob = ({ data, currentPage, limit }) => {
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
                  ID
                </td>
                <td
                  className="border-b-2 border-[#949494] p-3"
                  style={wrapStyle}
                >
                  {item.id}
                </td>
              </tr>
              <tr>
                <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                  Number
                </td>
                <td
                  className="border-b-2 border-[#949494] p-3"
                  style={wrapStyle}
                >
                  {item.number}
                </td>
              </tr>
              <tr>
                <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                  OTP
                </td>
                <td
                  className="border-b-2 border-[#949494] p-3"
                  style={wrapStyle}
                >
                  <span dangerouslySetInnerHTML={{ __html: item.otps }} />
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
                  {moment(item.date_time, "MM/DD/YYYYTHH:mm:ss A").format(
                    "DD/MM/YYYY hh:mm:ss A"
                  )}
                </td>
              </tr>
              <tr>
                <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                  Service
                </td>
                <td
                  className="border-b-2 border-[#949494] p-3"
                  style={wrapStyle}
                >
                  {item.service}
                </td>
              </tr>
              <tr>
                <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                  Server
                </td>
                <td
                  className="border-b-2 border-[#949494] p-3"
                  style={wrapStyle}
                >
                  {item.server}
                </td>
              </tr>
              <tr>
                <td className="border-b-2 border-[#949494] p-3 px-5 text-[#959595]">
                  Price
                </td>
                <td
                  className="border-b-2 border-[#949494] p-3"
                  style={wrapStyle}
                >
                  {item.price}
                </td>
              </tr>
              <tr>
                <td className="p-3 px-5 text-[#959595]" style={wrapStyle}>
                  Status
                </td>
                <td className="p-3">{statusMap[item.status] || ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ))}
    </>
  );
};
export default AppLayout()(History);
