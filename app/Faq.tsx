'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQs() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'When is the Last day to register for Metallix 2026?',
            answer: 'The last date to register for Metallix 2024 is 10th March, 2026.',
        },
        {
            id: 'item-2',
            question: 'Who all can participate in this Metallix 2026?',
            answer: 'Students from any college/university can participate in Metallix 2026.',
        },
        {
            id: 'item-3',
            question: 'On which day will the events be conducted?',
            answer: 'The events are distributed across both days, i.e - 20th and 21st March, 2026.',
        },
        {
            id: 'item-4',
            question: 'Will the events be held in online or offline mode?',
            answer: 'While some events will be held online, other events will be held strictly in offline mode. Refer to the events section for more details.',
        },
        {
            id: 'item-5',
            question: 'Can a student attend the symposium as well as take part in the events?',
            answer: 'Yes! All students can attend the symposium as well as participate in the events',
        },
        {
            id: 'item-6',
            question: 'How and when can I reach the venue for the event?',
            answer: 'Kindly visit the \'Contact\' section of our website, which has the location and schedule of the events.',
        },
        {
            id: 'item-7',
            question: 'Will be there any cash prizes for the winners of the events?',
            answer: 'Yes! A total cash pool prize of 1 lakh INR is declared for Metallix 2024.',
        },
        {
            id: 'item-8',
            question: 'Is there any registration fee for participating in the events?',
            answer: 'There are no registration fees for participating in any of the events of Metallix 2024 for both JU/Non-JU students.',
        },
        {
            id: 'item-9',
            question: 'Can students of other departments participate in the events of Metallix?',
            answer: 'Absolutely! Students of any department can participate in any event.',
        },
        {
            id: 'item-10',
            question: 'Would students from other colleges get accommodation facilities?',
            answer: 'Accommodation will be provided to selected students only. Team Metallix will contact them shortly after registrations.',
        },
        {
            id: 'item-11',
            question: 'Will there be an arrangement for food?',
            answer: 'Food facilities will be provided to Non-JU students. However they will need to pay Rs. 150 for each day.',
        },
        {
            id: 'item-12',
            question: 'Whom to reach out to in case of any trouble?',
            answer: 'You can contact us through the \'Contact\' section of the website or simply shoot a mail to metallixju2024@gmail.com',
        },
    ]

    return (
        <section className="py-16 md:py-24 bg-black">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid gap-8 md:grid-cols-5 md:gap-12">
                    <div className="md:col-span-2">
                        <h2 className="text-white text-4xl font-semibold">FAQs</h2>
                        <p className="text-neutral-400 mt-4 text-balance text-lg">Your questions answered</p>
                        <p className="text-neutral-400 mt-6 hidden md:block">
                            Cannot find what you are looking for? Contact our{' '}
                            <Link
                                href="#"
                                className="text-neutral-200 font-medium hover:underline hover:text-white transition-colors">
                                Metallix Organising Team
                            </Link>
                        </p>
                    </div>

                    <div className="md:col-span-3">
                        <Accordion
                            type="single"
                            collapsible>
                            {faqItems.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="border-neutral-800">
                                    <AccordionTrigger className="cursor-pointer text-base hover:no-underline text-white hover:text-neutral-300 transition-colors">
                                        {item.question}
                                    </AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-base text-neutral-400">{item.answer}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>

                    <p className="text-neutral-400 mt-6 md:hidden">
                        Cannot find what you are looking for? Contact our{' '}
                        <Link
                            href="#"
                            className="text-neutral-200 font-medium hover:underline hover:text-white transition-colors">
                            customer support team
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}