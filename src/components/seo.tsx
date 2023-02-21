import Head from "next/head";

type SEOProps = {
  title?: string;
  description?: string;
};

const SEO = ({ title, description }: SEOProps) => {
  return (
    <Head>
      <title>{title ?? "GradeMyAid"}</title>
      <meta
        name="description"
        content={
          description ??
          "Grade and compare scores of your college financial aid packages using data from the US Department of Education."
        }
      />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEO;
