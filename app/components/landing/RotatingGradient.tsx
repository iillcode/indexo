"use client";
import { Card, CardContent } from "@/app/components/landing/Card";
import { Button } from "@/app/components/landing/Buttons";
import { ArrowRight } from "lucide-react";
import Feature1 from "./Feature";
import { FeatureSectionData } from "@/app/data/featureSectionData";

interface RotatingGradientProps {
  data: FeatureSectionData;
  isFirstSection?: boolean;
}

export default function RotatingGradientRight({
  data,
  isFirstSection = false,
}: RotatingGradientProps) {
  return (
    <section
      className="w-full bg-[#101010] text-foreground px-6 pt-44 md:px-16 lg:px-24"
      id={isFirstSection ? "features" : undefined}
    >
      <div className="relative mx-auto max-w-2xl text-center sm:text-cente ">
        <h3 className="font-geist mt-4 text-3xl font-normal tracking-tighter sm:text-4xl md:text-5xl whitespace-nowrap overflow-hidden text-ellipsis">
          {data.title}
        </h3>
        <p className="font-geist text-foreground/60 mt-3">{data.subtitle}</p>
      </div>
      {/* <hr className="bg-foreground/30 mx-auto mt-9 h-px w-1/2 " /> */}
      <div
        className={`mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2 mt-18 ${
          data.layout === "rtl" ? "md:grid-flow-col-dense" : ""
        }`}
      >
        {/* Card Section */}
        <div
          className={`relative mx-auto flex h-[25rem] w-full max-w-[60rem] items-center justify-center overflow-hidden rounded-2xl ${
            data.layout === "rtl" ? "md:order-2" : "md:order-1"
          }`}
        >
          {/* Rotating conic gradient glow */}
          <div className="absolute -inset-10 flex items-center justify-center">
            <div
              className="
                h-[90%] w-[120%] rounded-[36px] blur-3xl opacity-50
                bg-[conic-gradient(from_0deg,theme(colors.orange.400),theme(colors.red.400),theme(colors.orange.500),theme(colors.orange.600),theme(colors.red.500),theme(colors.orange.400))]
                animate-[spin_8s_linear_infinite]
              "
            />
          </div>
          {/* Black card inside the glow */}
          <Card className="w-[98%] h-[98%] z-10 rounded-2xl border border-white/10 bg-black/85 shadow-2xl backdrop-blur-xl  flex items-center justify-center ">
            <CardContent className="flex items-center justify-center w-full">
              <img
                className="w-[70%] "
                src="https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/nextdotjs.svg"
                alt=""
              />
            </CardContent>
          </Card>
        </div>
        {/* Content Section */}
        <div
          className={`space-y-4 ${
            data.layout === "rtl" ? "md:order-1" : "md:order-2"
          }`}
        >
          <h2 className="text-lg sm:text-xl lg:text-3xl font-normal ">
            {data.contentSection.title}{" "}
            <span className="text-muted-foreground text-sm sm:text-base lg:text-2xl">
              {data.contentSection.subtitle}
            </span>
          </h2>
          <Button
            variant="link"
            className="px-0 text-orange-500 hover:text-orange-600"
          >
            {data.contentSection.buttonText} <ArrowRight />
          </Button>
        </div>
      </div>
      <section className="p-16">
        <Feature1 features={data.features} />
      </section>
    </section>
  );
}
