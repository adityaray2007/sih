 "use client";
import React, { useState, useRef } from "react";
import Link from "next/link";

const IndiaLandingPage = ({
  videoSrc = "/cyclone.mp4",       // Background for hero
  secondBgimage = "/dada.jpeg",             // Background for mission/problem section
  thirdBgImage = "/ma.jpeg", // Background image for 3rd section
  overlayOpacity = 0.6,
  showDefaultPattern = true,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  // Features / Platform modules
  const disasters = [
    {
      title: "Role-Based Login",
      desc: "Secure login via Email or Google with Student, Teacher, and Admin roles.",
      icon: "🔑",
      color: "from-purple-500 to-indigo-600",
    },
    {
      title: "Dashboard",
      desc: "View and access all disaster preparedness modules from one place.",
      icon: "📊",
      color: "from-blue-500 to-cyan-600",
    },
    {
      title: "Disaster Modules",
      desc: "Text, audio (TTS), captions, and Do’s & Don’ts for Earthquake, Flood, Fire, and Cyclone.",
      icon: "📚",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Real-Time Alerts",
      desc: "Popup + sound + vibration alerts pushed instantly to users.",
      icon: "🚨",
      color: "from-red-500 to-pink-600",
    },
    {
      title: "Evacuation Maps",
      desc: "Institutions can upload and share evacuation maps (image or PDF).",
      icon: "🗺️",
      color: "from-amber-500 to-orange-600",
    },
    {
      title: "Emergency Contacts",
      desc: "Quick access to teachers, admins, and local authority contacts.",
      icon: "📞",
      color: "from-teal-500 to-cyan-600",
    },
    {
      title: "Quizzes",
      desc: "Short quizzes with instant scoring and feedback for students.",
      icon: "📝",
      color: "from-pink-500 to-rose-600",
    },
    {
      title: "Accessibility Modes",
      desc: "Blind, Deaf, and Blind+Deaf modes (TTS, captions, vibration).",
      icon: "♿",
      color: "from-gray-500 to-gray-700",
    },
    {
      title: "Rule-Based Chatbot",
      desc: "Fast, offline-ready chatbot for disaster FAQs (no AI delay).",
      icon: "🤖",
      color: "from-indigo-500 to-purple-600",
    },
    {
      title: "Govt. Alerts Feed",
      desc: "Automatic NDMA/IMD RSS feed integration for verified alerts.",
      icon: "📡",
      color: "from-yellow-400 to-orange-500",
    },
  ];

  // Slider controls
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % disasters.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + disasters.length) % disasters.length);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
  };
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.clientX);
  };
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setTranslateX(startX - e.touches[0].clientX);
  };
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setTranslateX(startX - e.clientX);
  };
  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (Math.abs(translateX) > 100) {
      translateX > 0 ? nextSlide() : prevSlide();
    }
    setTranslateX(0);
  };
  const goToSlide = (index: number) => setCurrentSlide(index);

  return (
    <div className="bg-gray-900 text-white">
      {/* ========== HERO SECTION ========== */}
      <div className="min-h-screen relative overflow-hidden">
        {/* Background Video */}
        {videoSrc && (
          <video
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
          />
        )}

        {/* Fallback Pattern */}
        {!videoSrc && showDefaultPattern && (
          <div
            className="absolute inset-0 opacity-30 z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Crect fill='%23444' width='1200' height='800'/%3E%3Cpolygon fill='%23666' points='100,200 300,150 250,400 50,450'/%3E%3Cpolygon fill='%23555' points='400,100 600,80 580,300 380,320'/%3E%3Cpolygon fill='%23777' points='700,250 900,200 850,450 650,500'/%3E%3Cpolygon fill='%23333' points='200,500 400,480 380,700 180,720'/%3E%3Cpolygon fill='%23888' points='800,400 1000,350 950,600 750,650'/%3E%3C/svg%3E")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        )}

        {/* Dark Overlay */}
        <div
          className="absolute inset-0 bg-black z-0"
          style={{ opacity: overlayOpacity }}
        ></div>

        {/* Content */}
        <div className="relative z-10 h-screen">
  {/* Login & Signup Buttons */}
  <div className="absolute top-6 right-6 md:top-8 md:right-12 flex gap-3">
    <Link
      href="/login"
      className="bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-2 rounded-full text-sm font-medium text-white hover:bg-white/30 transition-all"
    >
      Login
    </Link>
    <Link
      href="/signup"
      className="bg-white/20 backdrop-blur-sm border border-white/30 px-5 py-2 rounded-full text-sm font-medium text-white hover:bg-white/30 transition-all"
    >
      Signup
    </Link>
  </div>
          {/* Headline */}
          <div className="absolute top-1/4 left-8 md:left-16 transform -translate-y-1/4">
            <div className="text-left">
              <h1 className="text-5xl md:text-8xl font-black leading-tight mb-4">
                <div className="text-white">DISASTER</div>
                <div className="text-white -mt-2 md:-mt-3">PREPAREDNESS</div>
              </h1>
              <h2
                className="text-5xl md:text-8xl font-black mt-6 md:mt-8 text-transparent"
                style={{ WebkitTextStroke: "2px #ef4444" }}
              >
                INDIA
              </h2>
            </div>
          </div>

          {/* Disaster Cards */}
          <div className="absolute bottom-24 left-6 md:left-16 flex space-x-6 overflow-x-auto pb-4 pr-4">
            {[
              { title: "FLOODS", desc: "Devastating monsoon floods..." },
              { title: "LANDSLIDES", desc: "Wayanad landslides claim 254 lives..." },
              { title: "CYCLONE", desc: "Cyclone Fengal devastates southern India..." },
              { title: "EARTHQUAKES", desc: "Seismic activity increases across Himalayas..." },
              { title: "DROUGHT", desc: "Severe droughts affect Maharashtra, Karnataka..." },
            ].map((item, index) => (
              <div
                key={index}
                className="max-w-xs flex-shrink-0 bg-black bg-opacity-70 p-6 rounded-lg border border-gray-600 cursor-pointer hover:bg-opacity-80 transition-all"
              >
                <div className="flex items-start mb-3">
                  <div
                    className="w-3 h-3 rounded-full mr-3 mt-1 animate-pulse"
                    style={{ backgroundColor: "#dc2626" }}
                  ></div>
                </div>
                <h3 className="text-white font-bold text-lg mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Explore Button */}
          <div className="absolute bottom-8 right-6 md:right-8">
            <button
              onClick={() =>
                document
                  .getElementById("mission-section")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="bg-gray-800 bg-opacity-80 text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-opacity-90 transition-all flex items-center space-x-2 border border-gray-600"
            >
              <span>🔍</span>
              <span>Why it matters?</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========== PROBLEM STATEMENT SECTION ========== */}
      <div
        id="mission-section"
        className="min-h-screen bg-gray-900 text-white px-6 md:px-16 py-20 flex items-start pt-32 relative overflow-hidden -mt-[1px]"
      >
       {/* Background Image */}
  {secondBgimage && (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `url(${secondBgimage})`,
      }}
    ></div>
  )}
        <div
          className="absolute inset-0 bg-black z-0"
          style={{ opacity: overlayOpacity }}
        ></div>

        <div className="w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          {/* Left Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Lack of Education",
                desc: "Most schools in India do not have structured disaster preparedness programs...",
              },
              {
                title: "Ineffective Drills",
                desc: "Occasional safety drills are poorly planned, irregular, or lack realism...",
              },
              {
                title: "Panic Response",
                desc: "In absence of training, panic leads to confusion and injuries...",
              },
              {
                title: "Digital Solution",
                desc: "An interactive platform can revolutionize preparedness education...",
              },
              {
                title: "Lack of Awareness",
                desc: "Many teachers and students rely on outdated or incorrect protocols...",
              },
              {
                title: "Outdated Infrastructure",
                desc: "Many schools lack fire alarms, evacuation maps, and earthquake-resistant structures...",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-black bg-opacity-70 p-5 rounded-lg border border-gray-600 hover:bg-opacity-80 transition-all shadow-lg inline-block"
              >
                <h3 className="text-white font-bold text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Right Mission */}
          <div className="text-left flex flex-col justify-center space-y-6 text-gray-300 leading-relaxed text-sm md:text-base md:pl-12">
            <div className="text-gray-400 text-xs md:text-sm font-medium uppercase tracking-wider">
              OUR MISSION
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-white text-right">
              WHY DISASTER PREPAREDNESS MATTERS?
            </h2>

            <p>
              Every year, <span className="font-semibold text-white">millions of students in India</span> are exposed to natural disasters like earthquakes, floods, cyclones, and fires. Yet most schools <span className="text-red-400 font-medium">do not have structured disaster education programs</span>, leaving children, teachers, and communities unprepared.
            </p>

            <p>
              <span className="font-semibold text-white">Emergency drills</span> are often rare, outdated, or treated as a formality. When real disasters strike, this lack of preparedness leads to <span className="font-semibold">panic, confusion, and preventable loss of life</span>.
            </p>

            <p>
              <span className="font-bold text-white">Our solution:</span>{" "}
              <span className="font-bold text-red-500">a digital, accessible, interactive learning platform</span>{" "}
              designed specifically for schools and institutions. It delivers clear disaster preparedness training through engaging modules, real-time alerts, evacuation maps, quizzes, and accessibility-first tools — so that <span className="font-semibold text-white">no student is left behind in a crisis</span>.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                <p className="text-3xl font-bold text-red-500">90%</p>
                <p className="text-sm">Schools lack disaster plans</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                <p className="text-3xl font-bold text-red-500">3M+</p>
                <p className="text-sm">Students at risk</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                <p className="text-3xl font-bold text-red-500">5x</p>
                <p className="text-sm">Higher survival rate with training</p>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 text-center shadow-lg">
                <p className="text-3xl font-bold text-red-500">24/7</p>
                <p className="text-sm">Access to digital learning</p>
              </div>
            </div>
            <button className="bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white hover:bg-white/30 transition-colors">
              Learn more
            </button>
          </div>
        </div>
      </div>

      {/* ========== SLIDING CARDS SECTION (Platform Features) ========== */}
      <div
        id="kepler-section"
        className="min-h-screen relative overflow-hidden -mt-[1px] text-white"
      >
        {/* Background Image */}
        {thirdBgImage && (
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${thirdBgImage})` }}
          ></div>
        )}
        {/* Dark Overlay */}
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: overlayOpacity }}
        ></div>

        {/* Content */}
        <div className="relative z-10 px-6 md:px-16 py-20 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black mb-4 bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
              Platform Features
            </h2>
           <p
  className="text-lg max-w-2xl mx-auto text-transparent"
  style={{ WebkitTextStroke: "1px #ef4444" }} // red stroke
>
              Discover the features that make our disaster preparedness platform effective.
            </p>
          </div>

          {/* Slider */}
          <div
            className="relative overflow-hidden rounded-2xl"
            ref={sliderRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleEnd}
            onMouseLeave={handleEnd}
          >
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{
                transform: `translateX(-${currentSlide * 100}%) translateX(${
                  isDragging ? -translateX : 0
                }px)`,
              }}
            >
              {disasters.map((disaster, idx) => (
                <div
                  key={idx}
                  className="flex-shrink-0 w-full flex justify-center items-center min-h-[400px] p-6"
                >
                  <div
                    className={`max-w-md w-full rounded-2xl p-8 shadow-xl bg-gradient-to-br ${disaster.color} text-white transform hover:scale-105 transition-transform`}
                  >
                    <div className="text-4xl mb-4">{disaster.icon}</div>
                    <h3 className="text-2xl font-bold mb-4">{disaster.title}</h3>
                    <p className="text-white/90 text-sm leading-relaxed mb-6">
                      {disaster.desc}
                    </p>
                    <button className="bg-white/20 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 text-xs text-white hover:bg-white/30 transition-colors">
                      Learn more
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border border-gray-600 rounded-full p-3 z-10"
            >
              ◀️
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 border border-gray-600 rounded-full p-3 z-10"

            >
              ▶️
            </button>
          </div>

          {/* Dots */}
          <div className="flex justify-center space-x-2 mt-8">
            {disasters.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  currentSlide === index
                    ? "bg-white"
                    : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4 text-gray-400 text-sm">
            {currentSlide + 1} of {disasters.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndiaLandingPage;