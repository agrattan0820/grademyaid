import { fetchSchoolById } from "./school-queries";

/**
 * Linear Interpolation
 * https://www.trysmudford.com/blog/linear-interpolation-functions/
 */
const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
const invlerp = (x: number, y: number, a: number) => clamp((a - x) / (y - x));
const clamp = (a: number, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const range = (x1: number, y1: number, x2: number, y2: number, a: number) =>
  lerp(x2, y2, invlerp(x1, y1, a));

export type LocationType = "inState" | "outState";

/**
 * Average Net Price for Private Colleges (2019): $14,610
 * Average Net Price for Public Colleges (2019): $3,740
 *
 * Graduation Rate Midpoint for 4-yr Schools: 57%
 * Average Annual Cost Midpoint for 4-yr Schools: $19,526
 * Median Earnings Midpoint for 4-yr Schools: $47,922
 *
 */

type Inequality = "greater" | "lesser";
function scoreDifferential(difference: number, desiredInequality: Inequality) {
  let scoreValue = 0;

  if (desiredInequality === "greater") {
    if (difference >= 3) {
      scoreValue += 5;
    } else if (difference >= 2) {
      scoreValue += 3.5;
    } else if (difference >= 1) {
      scoreValue += 2.5;
    } else if (difference >= 0.75) {
      scoreValue += 1.5;
    } else if (difference >= 0.5) {
      scoreValue += 1;
    } else if (difference >= 0.25) {
      scoreValue += 0.75;
    } else if (difference >= 0.1) {
      scoreValue += 0.5;
    } else if (difference >= 0) {
      scoreValue += 0.25;
    } else if (difference >= -0.1) {
      scoreValue -= 0.25;
    } else if (difference >= -0.25) {
      scoreValue -= 0.5;
    } else if (difference >= -0.5) {
      scoreValue -= 0.75;
    } else if (difference >= -1) {
      scoreValue -= 1;
    } else if (difference >= -2) {
      scoreValue -= 2.5;
    } else if (difference >= -3) {
      scoreValue -= 3.5;
    } else {
      scoreValue -= 5;
    }
  } else {
    if (difference <= -3) {
      scoreValue += 5;
    } else if (difference <= -2) {
      scoreValue += 3.5;
    } else if (difference <= -1) {
      scoreValue += 2.5;
    } else if (difference <= -0.75) {
      scoreValue += 1.5;
    } else if (difference <= -0.5) {
      scoreValue += 1;
    } else if (difference <= -0.25) {
      scoreValue += 0.75;
    } else if (difference <= -0.1) {
      scoreValue += 0.5;
    } else if (difference <= 0) {
      scoreValue += 0.25;
    } else if (difference <= 0.1) {
      scoreValue -= 0.25;
    } else if (difference <= 0.25) {
      scoreValue -= 0.5;
    } else if (difference <= 0.5) {
      scoreValue -= 0.75;
    } else if (difference <= 1) {
      scoreValue -= 1;
    } else if (difference <= 2) {
      scoreValue -= 2.5;
    } else if (difference <= 3) {
      scoreValue -= 3.5;
    } else {
      scoreValue -= 5;
    }
  }

  return scoreValue;
}

function calculateDifference(institutionNum: number, overallNum: number) {
  return (overallNum - institutionNum) / overallNum;
}

export function calculateStudentPrice(
  school: any,
  aidAmount: number,
  location: "in_state" | "out_of_state"
) {
  const tuition = school.latest.cost.tuition[location];
  const roomboard = school.latest.cost.roomboard.oncampus;
  const booksupply = school.latest.cost.booksupply;
  const otherExpenses = school.latest.cost.otherexpense.oncampus;

  const total = tuition + roomboard + booksupply + otherExpenses - aidAmount;

  return total > 0 ? total : 0;
}

/**
 *
 * @param schoolId number
 * @param aidAmount number
 * @param inStateOutState LocationType
 *
 *
 */
export async function calculateScore(
  schoolId: number,
  aidAmount: number,
  inStateOutState: LocationType
) {
  let score = 0;

  const location = inStateOutState === "inState" ? "in_state" : "out_of_state";

  const schoolResponse = await fetchSchoolById(schoolId);
  const selectedSchool = schoolResponse.data.results[0];
  console.log(selectedSchool);

  // OVERALL STATISTICS ACROSS ALL SCHOOLS
  const overallAverageNetPrice =
    selectedSchool.latest.cost.avg_net_price.consumer.median_by_pred_degree;
  const overallGraduationRate = 0.57; // TODO: find average graduation rate within data
  const overallMedianEarnings =
    selectedSchool.latest.earnings["10_yrs_after_entry"].consumer
      .median_by_pred_degree;
  const overallTransferRate = 0.17; // https://www.univstats.com/academic/transfer-out-rate/

  // INSTITUTION STATS
  const averageNetPrice = selectedSchool.latest.cost.avg_net_price.overall;
  const graduationRate = selectedSchool.latest.completion.consumer_rate;
  const medianEarnings =
    selectedSchool.latest.earnings["10_yrs_after_entry"].median;
  const transferRate =
    selectedSchool.latest.completion.transfer_rate["4yr"].full_time;

  // CALCULATE PERCENTAGE DIFFERENCE
  const priceDifference = calculateDifference(
    averageNetPrice,
    overallAverageNetPrice
  );
  const graduationDifference = calculateDifference(
    graduationRate,
    overallGraduationRate
  );
  const medianEarningsDifference = calculateDifference(
    medianEarnings,
    overallMedianEarnings
  );
  const transferDifference = calculateDifference(
    transferRate,
    overallTransferRate
  );

  // STUDENT PRICE DIFFERENCE
  const studentPrice = calculateStudentPrice(
    selectedSchool,
    aidAmount,
    location
  );

  const studentPriceDifference = calculateDifference(
    studentPrice,
    averageNetPrice
  );

  console.log("vs:", averageNetPrice, overallAverageNetPrice);
  console.log("studentPriceDifference:", studentPriceDifference);
  console.log("priceDifference:", priceDifference);
  console.log("graduationDifference:", graduationDifference);
  console.log("medianEarningsDifference:", medianEarningsDifference);
  console.log("transferDifference:", transferDifference);

  // ADD TO SCORE BASED ON DIFFERENCE
  score += scoreDifferential(priceDifference, "greater");
  score += scoreDifferential(graduationDifference, "lesser");
  score += scoreDifferential(medianEarningsDifference, "lesser");
  score += scoreDifferential(transferDifference, "lesser");

  let studentScore = 0;

  if (studentPrice !== 0) {
    studentScore += scoreDifferential(studentPriceDifference, "greater");
    studentScore += scoreDifferential(studentPriceDifference, "greater");
    studentScore += scoreDifferential(studentPriceDifference, "greater");
    studentScore += scoreDifferential(studentPriceDifference, "greater");
  } else {
    studentScore += 10;
  }

  score += studentScore;

  return Number.parseFloat(range(-10, 10, 0, 10, score).toFixed(1));
}
