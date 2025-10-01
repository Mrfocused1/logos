import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';
import { Sparkles } from 'lucide-react';

// Utility function for combining class names (in case it doesn't exist)
// This is equivalent to the cn function from shadcn/ui

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
  features?: string[];
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
  features = [],
}: DisplayCardProps) {
  return (
    <motion.div
      className={cn(
        "relative flex h-80 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 bg-white/70 backdrop-blur-sm px-6 py-5 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-purple-50/90 after:to-transparent after:content-[''] hover:border-white/30 hover:bg-white/80 [&>*]:flex [&>*]:flex-col [&>*]:gap-2",
        className
      )}
      whileHover={{ scale: 1.02, y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3">
        <span className="relative inline-block rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-3">
          {icon}
        </span>
        <p className={cn("text-xl font-bold font-heading", titleClassName)}>{title}</p>
      </div>

      <div className="flex-1">
        <p className="text-gray-600 leading-relaxed mb-4">{description}</p>

        {features.length > 0 && (
          <ul className="space-y-2">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-center text-sm text-gray-700">
                <span className="w-2 h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mr-3 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
        )}
      </div>

      {date && (
        <p className="text-sm text-gray-500 font-medium">{date}</p>
      )}
    </motion.div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
  services?: Array<{
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    features: string[];
  }>;
}

export default function DisplayCards({ cards, services }: DisplayCardsProps) {
  const defaultCardConfigs = [
    {
      className: "[grid-area:stack] hover:-translate-y-16 hover:z-30 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 grayscale-[60%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 transition-all duration-700",
    },
    {
      className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-8 hover:z-20 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 grayscale-[60%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0 transition-all duration-700",
    },
    {
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:-translate-y-32 hover:z-40 transition-all duration-700",
    },
  ];

  // Convert services data to card data if services are provided
  let displayCards = cards;

  if (services && services.length > 0) {
    displayCards = services.map((service, index) => {
      const Icon = service.icon;
      return {
        ...defaultCardConfigs[index] || defaultCardConfigs[2],
        icon: <Icon className="size-6 text-white" />,
        title: service.title,
        description: service.description,
        features: service.features,
        titleClassName: "text-gray-900",
        date: `0${index + 1}`,
      };
    });
  }

  if (!displayCards) {
    displayCards = defaultCardConfigs.map(config => ({ ...config }));
  }

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700 min-h-[600px] relative overflow-visible pt-16 pb-32">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}