"use client";
import React from "react";
import { motion } from "framer-motion";

export interface Service {
  text: string;
  icon: React.ReactNode;
  name: string;
  features: string[];
}

export const ServicesColumn = (props: {
  className?: string;
  services: Service[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.services.map(({ text, icon, name, features }, i) => (
                <div className="p-8 rounded-3xl border shadow-lg max-w-xs w-full bg-white" key={i}>
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    {icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{name}</h3>
                  <div className="text-gray-600 mb-4">{text}</div>
                  <ul className="text-sm text-gray-500 space-y-1">
                    {features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};