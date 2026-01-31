"use client";
import { TextRevealByWord } from "@/components/ui/text-reveal";
import { cn } from "@/lib/utils";

export function TextRevealDemo() {
  return (
    <section className="w-full flex justify-center py-20 bg-black text-white">
      <div className="w-full max-w-5xl mx-auto px-4">
        <div
          className={cn(
            "rounded-lg w-full min-h-75",
            "flex items-center justify-center",
          )}
        >
          <TextRevealByWord
            text="Metallix 2026, a premier two-day techno-metal spectacle organized by Jadavpur University's Department of Metallurgical and Material Engineering, stands as Eastern India's leading metallurgical fest. This event is a hub for intellect, innovation, and industry insights, drawing participants from metallurgical and materials engineering disciplines nationwide.Metallix will encompass a series of enlightening sessions, panel discussions, and competitions, providing a platform for industry professionals, stakeholders, and enthusiasts to exchange ideas and insights.Join us on 20th & 21st March, 2026!"
            className="dark"
          />
        </div>
      </div>
    </section>
  );
}
