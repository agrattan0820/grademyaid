# grademyaid

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Data Exploration

```javascript
axios({
  method: "GET",
  url: "https://api.data.gov/ed/collegescorecard/v1/schools.json",
  params: {
    id: "100654",
    api_key: `${COLLEGE_SCORECARD_API_KEY}`,
  },
});
```

### Data keys

- `latest` contains info on all aspect about the given school
- `school` contains only school contextual information (location, url, etc.)
- `location` contains the latitude and longitude of the school

### Cool College Scorecard Datapoints

- `school.price_calculator_url`
- `school.carnegie_size_setting` - gives us type of university, how big, and type of location
- `school.ft_faculty_rate` - percentage of faculty that is full-time
- `school.faculty_salary` - average salary per month for faculty
- `school.alias` - we can use as a code?
- `latest.cost.tuition.in_state`
- `latest.cost.tuition.out_of_state`
- `latest.cost.roomboard.oncampus`
- `latest.cost.roomboard.offcampus`
- `latest.cost.avg_net_price.public`
- `latest.cost.avg_net_price.overall`
- `latest.cost.avg_net_price.private`
- `latest.cost.otherexpense.oncampus`
- `latest.cost.otherexpense.offcampus`
- `latest.cost.attendance.academic_year`
- `latest.cost.net_price.public.by_income_level.${level}` - this is nuts, we can grab the net price and divide it by income level (0-30000, 0-48000, 75000-plus, 110001-plus, 30001-48000, 30001-75000, 48001-75000, 75001-110000)
- `latest.cost.net_price.private.by_income_level.${level}`
- `latest.aid.median_debt` - cool debt stats in here
- `latest.aid.cumulative_debt` - use a chart for these percentiles?
- `latest.earnings` - all of this is golden
- `latest.completion.completion_rate_4yr_150nt` - percentage of students who completed within 150% of the expected time
- `latest.completion.transfer_rate.4yr.full_time` - percentage of students who transfer
- `latest.admissions.admission_rate.overall` - percentage of students admitted/accepted
- `latest.admissions.sat_scores.average.overall` - average SAT score
- `latest.admissions.act_scores.midpoint.cumulative` - average ACT score
- `latest.admissions.act_scores.midpoint.cumulative` - average ACT score
- `latest.academics.program` - show available programs?
