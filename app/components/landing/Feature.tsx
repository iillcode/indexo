import { Shield } from "lucide-react";
import { Feature, iconMap } from "@/app/data/featureSectionData";

interface FeatureProps {
  features: Feature[];
}

export default function Feature1({ features }: FeatureProps) {
  const getIcon = (iconName: string) => {
    const IconComponent = iconMap[iconName as keyof typeof iconMap];
    return IconComponent ? (
      <IconComponent className="h-6 w-6" />
    ) : (
      <Shield className="h-6 w-6" />
    );
  };
  return (
    <section className="relative py-1" id="features">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="relative mt-2">
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((item, idx) => (
              <li
                key={idx}
                className="group space-y-3 rounded-xl border bg-transparent p-5 transition-shadow duration-300 [box-shadow:0_-20px_80px_-20px_rgba(255,115,0,0.2)_inset] hover:shadow-md"
              >
                <div className="text-orange-500 w-fit rounded-full border p-4 transition-colors duration-300">
                  {getIcon(item.icon)}
                </div>
                <h4 className="font-geist text-lg font-bold tracking-tighter">
                  {item.title}
                </h4>
                <p className="text-muted-foreground">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
