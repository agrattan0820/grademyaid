import { AnimatePresence, motion } from "framer-motion";
import { ReactNode, useState } from "react";
import { FiArrowDown, FiArrowUp, FiInfo, FiPlus } from "react-icons/fi";
import { usePopper } from "react-popper";
import { calculateStudentPrice } from "../../utils/calculate-score";
import { decimalAsPercent, numberWithCommas } from "../../utils/formatters";
import Modal from "../modal";

type StatBlockProps = {
  name: string;
  children: ReactNode;
  positive?: boolean;
  arrow?: "up" | "down";
};

const StatBlock = ({ name, children, positive, arrow }: StatBlockProps) => {
  return (
    <div className="flex flex-wrap items-center justify-between rounded-xl bg-emerald-50 p-4 text-sm font-bold shadow-emerald-300">
      <span>{name}</span>
      <span
        className={`${
          positive
            ? `text-emerald-500`
            : positive === false
            ? `text-rose-500`
            : ""
        } flex items-center`}
      >
        {arrow === "up" ? (
          <FiArrowUp />
        ) : arrow === "down" ? (
          <FiArrowDown />
        ) : null}
        {children}
      </span>
    </div>
  );
};

type GradeDataProps = {
  schoolData: any;
  financialAid: number;
  location: "in_state" | "out_of_state";
};

const GradeData = ({ schoolData, financialAid, location }: GradeDataProps) => {
  const [referenceElement, setReferenceElement] =
    useState<HTMLButtonElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const [tooltipIsOpen, setTooltipIsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  console.log("schoolData", schoolData);
  console.log("financialAid", financialAid);

  const data = {
    acceptanceRate: schoolData.latest.admissions.admission_rate.overall,
    graduationRate: {
      stat: schoolData.latest.completion.consumer_rate,
      positive: schoolData.latest.completion.consumer_rate > 0.57,
    },
    medianSalaries: [
      "6_yrs_after_entry",
      "7_yrs_after_entry",
      "8_yrs_after_entry",
      "9_yrs_after_entry",
      "10_yrs_after_entry",
    ].map((year) => {
      return {
        stat: schoolData.latest.earnings[year].median,
        positive:
          schoolData.latest.earnings[year].median >
          schoolData.latest.earnings[year]?.consumer?.median_by_pred_degree,
      };
    }),
    medianDebt: schoolData.latest.aid.median_debt.completers.overall,
    netPrice: {
      stat: schoolData.latest.cost.avg_net_price.overall,
      positive:
        schoolData.latest.cost.avg_net_price.overall <
        schoolData.latest.cost.avg_net_price.consumer.median_by_pred_degree,
    },
    roomBoardOff: schoolData.latest.cost.roomboard.offcampus,
    roomBoardOn: schoolData.latest.cost.roomboard.oncampus,
    studentPopulation: schoolData.latest.student.size,
    transferRate: {
      stat: schoolData.latest.completion.transfer_rate["4yr"].full_time,
      positive:
        schoolData.latest.completion.transfer_rate["4yr"].full_time > 0.17,
    },
    tuition: schoolData.latest.cost.tuition[location],
    yourNetPrice: calculateStudentPrice(schoolData, financialAid, location),
  };

  return (
    <>
      <section className="relative grid gap-4 md:grid-cols-2">
        <StatBlock
          name="Net Price Per Year"
          positive={data.netPrice.positive}
          arrow={data.netPrice.positive ? "up" : "down"}
        >
          {numberWithCommas(data.netPrice.stat, true)}
        </StatBlock>
        <StatBlock
          name="Median 10-Year Salary"
          positive={
            data.medianSalaries[data.medianSalaries.length - 1].positive
          }
          arrow={
            data.medianSalaries[data.medianSalaries.length - 1].positive
              ? "up"
              : "down"
          }
        >
          {numberWithCommas(
            data.medianSalaries[data.medianSalaries.length - 1].stat,
            true
          )}
        </StatBlock>
        <StatBlock
          name="Graduation Rate"
          positive={data.graduationRate.positive}
          arrow={data.graduationRate.positive ? "up" : "down"}
        >
          {decimalAsPercent(data.graduationRate.stat)}
        </StatBlock>
        <StatBlock
          name="Transfer Rate"
          positive={data.transferRate.positive}
          arrow={data.transferRate.positive ? "down" : "up"}
        >
          {decimalAsPercent(data.transferRate.stat)}
        </StatBlock>
        <StatBlock name="Your Location">
          {location === "in_state" ? "In-state" : "Out-of-state"}
        </StatBlock>
        <StatBlock name="Your Net Price">
          {data.yourNetPrice === 0
            ? "Free 🎉"
            : numberWithCommas(data.yourNetPrice, true)}
        </StatBlock>
        <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-8 shadow-emerald-300 md:col-span-2">
          <p className="flex items-center  font-bold lg:text-xl">
            Your Price Difference{" "}
            <button
              className="ml-1.5"
              onMouseEnter={() => setTooltipIsOpen(true)}
              onMouseLeave={() => setTooltipIsOpen(false)}
              ref={setReferenceElement}
            >
              <FiInfo />
            </button>
            <AnimatePresence>
              {tooltipIsOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="z-50 rounded-xl bg-emerald-500 py-2 px-4 text-sm text-white"
                  ref={setPopperElement}
                  style={styles.popper}
                  {...attributes.popper}
                >
                  Price difference is the <i>average</i> net tuition minus{" "}
                  <i>your</i> net tuition. <br />{" "}
                  <span className="text-emerald-100">Green</span> means you
                  would save more than an average student,{" "}
                  <span className="text-rose-100">red</span> means you would
                  spend more than an average student.
                </motion.div>
              )}
            </AnimatePresence>
          </p>
          {data.yourNetPrice - data.netPrice.stat > 0 ? (
            <p className="font-bold text-rose-600">
              {numberWithCommas(data.yourNetPrice - data.netPrice.stat, true)}
            </p>
          ) : (
            <p className="font-bold text-emerald-600">
              {numberWithCommas(
                Math.abs(data.yourNetPrice - data.netPrice.stat),
                true
              )}
              💰
            </p>
          )}
        </div>
        <AnimatePresence>
          {modalOpen && (
            <Modal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              key="Sponsorship Form"
            >
              <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center space-y-4 rounded-2xl bg-emerald-200 p-8 text-black">
                <ul className="grid w-full gap-4 md:grid-cols-2">
                  <StatBlock name="Tuition">
                    {numberWithCommas(data.tuition, true)}
                  </StatBlock>
                  <StatBlock name="Student Population">
                    {numberWithCommas(data.studentPopulation)}
                  </StatBlock>
                  <StatBlock name="Off Campus Housing">
                    {numberWithCommas(data.roomBoardOff, true)}
                  </StatBlock>
                  <StatBlock name="On Campus Housing">
                    {numberWithCommas(data.roomBoardOn, true)}
                  </StatBlock>
                  <StatBlock name="Median Debt">
                    {numberWithCommas(data.medianDebt, true)}
                  </StatBlock>
                  <StatBlock name="Median Debt">
                    {decimalAsPercent(data.acceptanceRate)}
                  </StatBlock>
                </ul>
              </div>
            </Modal>
          )}
        </AnimatePresence>
        <button
          className="absolute -bottom-8 flex items-center text-sm font-bold"
          onClick={() => setModalOpen(!modalOpen)}
        >
          See More <FiPlus className="ml-1" />
        </button>
      </section>
    </>
  );
};

export default GradeData;
