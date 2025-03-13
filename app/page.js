import HeroSection from "@/components/hero";
import { Button } from "@/components/ui/button";
import { featuresData, howItWorksData, statsData, testimonialsData } from "@/data/landing";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
   <div className=" mt-20">
    <HeroSection/>
    <section className="py-20 bg-gradient-to-r from-blue-50 to-blue-200">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-12 md:gap-16">
            {statsData.map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 bg-white shadow-lg rounded-lg transition-all transform hover:scale-105 hover:shadow-2xl duration-300 ease-in-out"
              >
                <div className="text-6xl font-extrabold text-blue-600 mb-4 transition-all duration-300 ease-in-out">
                  {stat.value}
                </div>
                <div className="text-lg font-medium text-gray-700 transition-all duration-300 ease-in-out">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section
        id="features"
        className="py-20 bg-gradient-to-r from-blue-50 to-blue-100"
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-blue-800 transition-all duration-500 ease-in-out">
            Everything you need to manage your finances
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-105 opacity-90 hover:opacity-100"
              >
                <div className="flex justify-center items-center mb-4">
                  <div className="text-4xl text-blue-600">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-center text-blue-700 mb-4 transition-all duration-300 ease-in-out">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center transition-all duration-300 ease-in-out">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-blue-50">
  <div className="container mx-auto px-4">
  <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
      {howItWorksData.map((step, index) => (
        <div
          key={index}
          className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-500 ease-in-out hover:scale-105 opacity-90 hover:opacity-100 cursor-pointer animate__animated animate__fadeInUp animate__delay-1s"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 transition-all duration-300 ease-in-out hover:bg-blue-200 transform">
            <div className="text-blue-600 text-3xl">{step.icon}</div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4 tracking-wide transition-all duration-300 ease-in-out">{step.title}</h3>
          <p className="text-gray-600 text-lg transition-all duration-300 ease-in-out">{step.description}</p>
        </div>
      ))}
    </div>
  </div>
</section>
<section id="testimonials" className="py-20">
  <div className="container mx-auto px-4">
    <h2 className="text-3xl font-bold text-center mb-16">
      What Our Users Say
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {testimonialsData.map((testimonial, index) => (
        <div key={index} className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-105">
          <div className="pt-4">
            <div className="flex items-center mb-4">
              <Image
                src={testimonial.image}
                alt={testimonial.name}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div className="ml-4">
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-gray-600">
                  {testimonial.role}
                </div>
              </div>
            </div>
            <p className="text-gray-600">{testimonial.quote}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
<section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances
            smarter with Welth
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50 animate-bounce"
            >
              Start Free Trial
            </Button>
          </Link>
        </div>
      </section>


   </div>
  );
}
