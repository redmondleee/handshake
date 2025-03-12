'use client'

import Image from "next/image";
import { createStudent, useListStudents } from "@/hooks/handshake";
import { MouseEventHandler } from "react";

export default function Home() {
  const students = useListStudents();

  const handleOnClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.preventDefault();

    await createStudent({ firstName: `Foo${Math.random()}`, lastName: `Bar${Math.random()}` });
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <button
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            onClick={handleOnClick}
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Create new student
          </button>
        </div>

        <table>

          <thead>
            <tr>
              <th>First name</th>
              <th>Last name</th>
              <th>Check in time</th>
            </tr>
          </thead>

          <tbody>
            {students.map(s => (
              <tr key={s.id}>
                <td>{s.firstName}</td>
                <td>{s.lastName}</td>
                <td>{s.checkInTime?.toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>

        </table>

      </main>
    </div>
  );
}
