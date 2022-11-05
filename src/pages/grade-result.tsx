import { NextPage } from "next";
import React, { useEffect, useState } from "react";

const GradeResultPage: NextPage = () => {
  /**
   * Tasks
   * - Save grade to Supabase database
   * - Pull in grade from data, Zustand?
   * - Show share button
   * - Show save button
   */

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-orange-300">
      <div>
        <p>Your grade:</p>
      </div>
      <div>
        <p className="text-9xl">10</p>
      </div>
      <button className="rounded bg-blue-300 font-bold">Share Grade</button>
      <button className="rounded bg-red-400 font-bold">Save Grade</button>
    </main>
  );
};

export default GradeResultPage;
