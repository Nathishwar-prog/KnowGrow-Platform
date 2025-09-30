"use client";

import React from "react";
import {
  BookOpen,
  Users,
  Star,
  Play,
  ArrowRight,
  Menu,
  X,
  CheckCircle,
  Brain,
  GraduationCap,
  Briefcase,
  Trophy,
  Sparkles,
  Zap,
  ChevronDown
} from "lucide-react";

// Using the UserButton placeholder for Clerk integration
const UserButton = () => (
    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
    </div>
);

// Using the RedirectButton from your authentication code
function RedirectButton({ label, href, variant = "primary", icon, className = "", onClick }) {
  const handleClick = () => {
    if(onClick) {
        onClick();
    } else {
        window.location.href = href;
    }
  };

  const baseClasses =
    "px-8 py-4 rounded-full font-semibold text-lg flex items-center justify-center space-x-2 group transition-all duration-300 cursor-pointer";
  const variants = {
    primary:
      "bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg hover:shadow-green-500/25 hover:scale-105",
    secondary: "border-2 border-green-400 hover:bg-green-400/10 text-green-600",
  };

  const icons = {
    arrow: <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />,
  };

  return (
    <button onClick={handleClick} className={`${baseClasses} ${variants[variant]} ${className}`}>
      <span>{label}</span>
      {icon && icons[icon]}
    </button>
  );
}

// Animated Brain Graphic for the Hero Section
const AnimatedBrain = () => {
    return (
        <div className="relative w-full h-96 flex items-center justify-center">
            <div className="absolute w-72 h-72 border-2 border-dashed border-green-300 rounded-full animate-spin-slow"></div>
            <div className="absolute w-96 h-96 border border-dashed border-teal-300 rounded-full animate-spin-slow-reverse"></div>
            <Brain className="w-40 h-40 text-green-500 opacity-20" />
            
            <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-green-400 rounded-full animate-pulse-orb" style={{transform: 'translate(-50%, -50%)'}}></div>

            {[...Array(6)].map((_, i) => (
                <div key={i} className="absolute top-1/2 left-1/2 w-2 h-2 bg-teal-400 rounded-full animate-orbit" style={{'--i': i}}></div>
            ))}
        </div>
    );
};

const HowItWorksModal = ({ show, onClose }) => {
    const [step, setStep] = React.useState(1);
    if (!show) return null;

    const stepsContent = [
        { 
            icon: <BookOpen className="w-6 h-6"/>, 
            title: "Create Your Course", 
            content: (
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Describe your learning goal in your own words. Our AI will do the rest.</p>
                    <textarea className="w-full h-24 p-3 border rounded-lg focus:ring-2 focus:ring-green-500 transition-shadow" placeholder="e.g., 'Master Python for data science in 3 months'"></textarea>
                    <button className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">Generate Roadmap</button>
                </div>
            )
        },
        { 
            icon: <Sparkles className="w-6 h-6"/>, 
            title: "Generate AI Content", 
            content: (
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Our AI creates a personalized roadmap with interactive modules just for you.</p>
                    <div className="p-4 bg-gray-100 rounded-lg border">
                        <p className="font-mono text-sm text-gray-500 animate-pulse">Generating modules...</p>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                            <div className="bg-green-500 h-2.5 rounded-full" style={{width: '75%', transition: 'width 2s ease-in-out'}}></div>
                        </div>
                        <p className="mt-3 text-sm text-green-700 font-semibold">✓ Course generated successfully!</p>
                    </div>
                </div>
            )
        },
        { 
            icon: <GraduationCap className="w-6 h-6"/>, 
            title: "Explore & Enroll", 
            content: (
                <div>
                     <p className="text-gray-600 mb-4 text-center">Browse your new course or explore other AI-generated learning paths.</p>
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer">
                            <h4 className="font-bold">Machine Learning</h4>
                            <div className="flex items-center text-sm text-gray-500"><Star className="w-4 h-4 text-yellow-400 fill-current mr-1"/> 4.9 (1,234 learners)</div>
                        </div>
                        <div className="bg-white p-4 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer">
                            <h4 className="font-bold">Web Development</h4>
                            <div className="flex items-center text-sm text-gray-500"><Star className="w-4 h-4 text-yellow-400 fill-current mr-1"/> 4.8 (2,456 learners)</div>
                        </div>
                     </div>
                </div>
            )
        },
        { 
            icon: <Trophy className="w-6 h-6"/>, 
            title: "Learn & Track Progress", 
            content: (
                 <div className="text-center">
                     <p className="text-gray-600 mb-4">Follow your roadmap and see your progress in real-time on your personal dashboard.</p>
                     <div className="p-4 bg-gray-100 rounded-lg border">
                        <p className="font-semibold mb-2">My Learnings: Python</p>
                        <div className="w-full bg-gray-200 rounded-full h-4">
                            <div className="bg-green-500 h-4 rounded-full text-white text-xs flex items-center justify-center" style={{width: '68%'}}>68%</div>
                        </div>
                        <div className="flex justify-between mt-3 text-sm">
                            <div><strong>Modules Done:</strong> 8/12</div>
                            <div><strong>Quizzes Passed:</strong> 6/8</div>
                        </div>
                     </div>
                 </div>
            )
        }
    ];

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 animate-fade-in-fast" onClick={onClose}>
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-4xl relative transform transition-all duration-300 animate-slide-up" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors">
                    <X className="w-7 h-7" />
                </button>
                <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">How The AI Tutor Works</h2>
                <div className="flex items-center justify-center space-x-4 md:space-x-8 mb-8">
                    {stepsContent.map((item, index) => (
                        <React.Fragment key={index}>
                            <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => setStep(index + 1)}>
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= index + 1 ? 'bg-green-600 border-green-600 text-white' : 'bg-white border-gray-300 text-gray-400'}`}>
                                    {item.icon}
                                </div>
                                <p className={`mt-2 font-semibold text-sm transition-colors ${step >= index + 1 ? 'text-green-600' : 'text-gray-500'}`}>{item.title}</p>
                            </div>
                            {index < stepsContent.length - 1 && <div className={`flex-1 h-0.5 mt-[-1rem] ${step > index + 1 ? 'bg-green-600' : 'bg-gray-300'}`}></div>}
                        </React.Fragment>
                    ))}
                </div>
                
                <div className="bg-gray-50 p-8 rounded-xl border min-h-[250px] flex items-center justify-center">
                    <div className="w-full max-w-md mx-auto">
                        {stepsContent[step - 1].content}
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <RedirectButton label="Get Started Now" href="/hub/product" variant="primary" icon="arrow"/>
                </div>
            </div>
        </div>
    );
};


export default function AiTutorPage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLoggedIn, setIsLoggedIn] = React.useState(false); // Simulated auth state
  const [isVisible, setIsVisible] = React.useState({});
  const [openFaq, setOpenFaq] = React.useState(null);
  const [showHowItWorksModal, setShowHowItWorksModal] = React.useState(false);


  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({...prev, [entry.target.id]: true}));
          }
        });
      },
      { threshold: 0.2 }
    );
    document.querySelectorAll("section[id]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const advantages = [
     { icon: <Zap className="w-8 h-8"/>, title: 'End Procrastination', description: 'Receive a clear, actionable plan that tells you exactly what to study and when, making it easy to get started.'},
     { icon: <Brain className="w-8 h-8"/>, title: 'Boost Retention', description: 'Our AI schedules revision sessions at scientifically optimal times to transfer knowledge to your long-term memory.'},
     { icon: <Users className="w-8 h-8"/>, title: 'Adapts to You', description: 'Life is unpredictable. Your study plan automatically adjusts to unexpected changes in your schedule.'}
  ];
  
  const faqs = [
      { q: "How does the AI personalization work?", a: "Our AI analyzes your initial goals, learning speed, and quiz results to constantly adapt your study material. If you're a visual learner, you'll get more diagrams. If you're struggling with a topic, the AI provides simpler explanations and more examples." },
      { q: "Is this suitable for absolute beginners?", a: "Yes! The AI Tutor is perfect for beginners. It breaks down complex subjects into manageable, easy-to-understand steps, ensuring you build a strong foundation before moving on to more advanced topics." },
      { q: "Can I use this to study for a specific exam?", a: "Absolutely. You can set a specific exam syllabus as your goal, and the AI will create a targeted study plan designed to cover all necessary topics, helping you prepare efficiently and effectively." },
      { q: "What happens if I fall behind schedule?", a: "No problem. The AI Tutor is designed to be flexible. It will automatically adjust your study plan to help you catch up, prioritizing the most critical topics to ensure you stay on track to meet your long-term goals." }
  ];


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans overflow-x-hidden">
      <style>{`
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow 25s linear infinite reverse; }

        @keyframes pulse-orb {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.7; }
        }
        .animate-pulse-orb { animation: pulse-orb 4s ease-in-out infinite; }
        
        @keyframes orbit {
          from { transform: rotate(0deg) translateX(150px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(150px) rotate(-360deg); }
        }
        .animate-orbit { animation: orbit 10s linear infinite; animation-delay: calc(var(--i) * 1.5s); }

        .gradient-text { background: linear-gradient(135deg, #10b981 0%, #059669 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .comparison-card::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 1rem;
            padding: 2px;
            background: linear-gradient(135deg, #10b981, #2dd4bf);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
        }
        .fade-in-up {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .is-visible .fade-in-up {
            opacity: 1;
            transform: translateY(0);
        }
        .animate-fade-in-fast { animation: fadeIn 0.3s ease-in-out; }
        .animate-slide-up { animation: slideUp 0.4s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
      `}</style>

      <HowItWorksModal show={showHowItWorksModal} onClose={() => setShowHowItWorksModal(false)} />

      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">KnowGrow</span>
            </a>
            <div className="hidden md:flex space-x-8 items-center">
              <a href="#faq" className="text-gray-600 hover:text-gray-900">FAQ</a>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              {isLoggedIn ? <UserButton /> : <RedirectButton label="Get Started" href="/sign-up" variant="primary" className="text-base px-6 py-2.5"/>}
            </div>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 rounded-lg">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        <div className={`md:hidden transition-all duration-300 overflow-hidden bg-white ${isMenuOpen ? "max-h-96 border-t border-gray-200" : "max-h-0"}`}>
          <div className="px-4 py-4 space-y-4 flex flex-col items-center">
             <a href="#faq" className="text-gray-600 hover:text-gray-900" onClick={() => setIsMenuOpen(false)}>FAQ</a>
            {isLoggedIn ? <UserButton /> : <RedirectButton label="Get Started" href="/sign-up" variant="primary" className="w-full text-base py-2.5"/>}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section id="hero" className={`pt-32 pb-20 text-center relative overflow-hidden bg-white ${isVisible.hero ? 'is-visible' : ''}`}>
           <div className="absolute inset-0 opacity-30" style={{background: 'radial-gradient(circle at top center, rgba(209,250,229,0.5) 0%, rgba(240,255,244,0) 50%)'}}></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight fade-in-up">
              Introducing Your Personal <span className="gradient-text">AI Tutor</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto fade-in-up" style={{transitionDelay: '200ms'}}>
              "The secret to getting ahead is getting started... breaking your complex, overwhelming tasks into small manageable tasks, and then starting on the first one." - Mark Twain
            </p>
            <div className="fade-in-up" style={{transitionDelay: '400ms'}}>
                <RedirectButton label="Start Learning Smarter" href="/workspace" variant="primary" icon="arrow"/>
            </div>
            <div className="mt-12 fade-in-up" style={{transitionDelay: '600ms'}}>
                <AnimatedBrain />
            </div>
          </div>
        </section>

        {/* Advantages Section */}
        <section id="advantages" className={`py-24 bg-gray-50 ${isVisible.advantages ? 'is-visible' : ''}`}>
             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="text-center mb-16">
                     <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 fade-in-up">Overcome Your Learning Hurdles</h2>
                     <p className="text-xl text-gray-600 max-w-3xl mx-auto fade-in-up" style={{transitionDelay: '200ms'}}>
                         Our AI Tutor is designed to solve the biggest problems students face.
                     </p>
                 </div>
                 <div className="grid md:grid-cols-3 gap-8">
                     {advantages.map((adv, index) => (
                         <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 text-center fade-in-up transform hover:-translate-y-2 transition-transform duration-300" style={{transitionDelay: `${400 + index * 200}ms`}}>
                             <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-xl flex items-center justify-center mb-6 mx-auto">
                                 {adv.icon}
                             </div>
                             <h3 className="text-xl font-bold text-gray-900 mb-3">{adv.title}</h3>
                             <p className="text-gray-600 leading-relaxed">{adv.description}</p>
                         </div>
                     ))}
                 </div>
                 <div className="mt-16 text-center fade-in-up" style={{transitionDelay: '800ms'}}>
                    <button onClick={() => setShowHowItWorksModal(true)} className="px-8 py-4 rounded-full font-semibold text-lg bg-white border-2 border-green-400 text-green-600 hover:bg-green-50 transition-colors flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl">
                        <Play className="w-6 h-6"/> See How It Works
                    </button>
                 </div>
             </div>
        </section>

        {/* Comparison Section */}
        <section id="comparison" className={`py-24 bg-white ${isVisible.comparison ? 'is-visible' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 fade-in-up">What Makes Our AI Tutor Different?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto fade-in-up" style={{transitionDelay: '200ms'}}>
                Stop trying to fit into a rigid system. We build the system around you.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-6xl mx-auto">
              {/* Traditional Learning */}
              <div className="relative bg-white p-8 rounded-2xl border-2 border-red-200 fade-in-up transform hover:scale-[1.02] transition-all duration-300" style={{transitionDelay: '400ms'}}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                  Old Way ⚠️
                </div>
                <h3 className="text-2xl font-bold text-center mb-8 text-gray-700 mt-2">Traditional Learning</h3>
                <div className="space-y-5 text-gray-700">
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <span className="text-2xl">❌</span>
                      <div>
                        <p className="font-semibold text-red-700">One-Size-Fits-All</p>
                        <p className="text-sm text-gray-600">Generic content that ignores your unique learning style</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <span className="text-2xl">❌</span>
                      <div>
                        <p className="font-semibold text-red-700">Forgetting Curve</p>
                        <p className="text-sm text-gray-600">Study today, forget tomorrow. No smart retention</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                      <span className="text-2xl">❌</span>
                      <div>
                        <p className="font-semibold text-red-700">Rigid Schedules</p>
                        <p className="text-sm text-gray-600">Can't adapt when life gets busy</p>
                      </div>
                    </div>
                </div>
              </div>
              {/* KnowGrow AI Tutor */}
              <div className="relative p-8 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 fade-in-up comparison-card transform hover:scale-[1.02] transition-all duration-300 shadow-xl" style={{transitionDelay: '600ms'}}>
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center space-x-2">
                  <Sparkles className="w-4 h-4"/>
                  <span>Smart Way ✨</span>
                </div>
                <h3 className="text-2xl font-bold text-center mb-8 gradient-text mt-2">KnowGrow AI Tutor</h3>
                <div className="space-y-5 text-gray-800">
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm border border-green-200">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-semibold text-green-700">Personalized For You</p>
                        <p className="text-sm text-gray-600">Adapts to your pace, strengths, and learning style</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm border border-green-200">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-semibold text-green-700">Smart Retention System</p>
                        <p className="text-sm text-gray-600">AI-powered spaced repetition for long-term memory</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 bg-white rounded-lg shadow-sm border border-green-200">
                      <span className="text-2xl">✅</span>
                      <div>
                        <p className="font-semibold text-green-700">Dynamic & Flexible</p>
                        <p className="text-sm text-gray-600">Automatically adjusts to your schedule changes</p>
                      </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </section>
         <section id="challenges" className={`py-24 bg-white ${isVisible.challenges ? 'is-visible' : ''}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 fade-in-up">The Scattered Learning Problem</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto fade-in-up" style={{transitionDelay: '200ms'}}>
                Juggling multiple platforms, losing track of progress, and feeling overwhelmed? You're not alone.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                {icon: '🎥', title: 'YouTube Channels', problems: ['No structure', 'Endless distractions', 'No progress tracking']},
                {icon: '🌐', title: 'Online Courses', problems: ['Outdated content', 'No personalization', 'Generic pace']},
                {icon: '📄', title: 'Documents & PDFs', problems: ['Information overload', 'No interactivity', 'Hard to retain']},
                {icon: '📚', title: 'Research Papers', problems: ['Too complex', 'No guidance', 'Disconnected topics']}
              ].map((source, index) => (
                <div key={index} className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-xl border-2 border-red-200 fade-in-up" style={{transitionDelay: `${400 + index * 100}ms`}}>
                  <div className="text-4xl mb-3 text-center">{source.icon}</div>
                  <h3 className="font-bold text-lg text-center text-gray-800 mb-3">{source.title}</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    {source.problems.map((problem, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-red-500 mr-2">×</span>
                        <span>{problem}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-red-200 via-yellow-200 to-green-400 transform -translate-y-1/2 fade-in-up" style={{transitionDelay: '800ms'}}></div>
              
              <div className="relative bg-gradient-to-br from-green-50 to-teal-50 p-10 rounded-3xl border-4 border-green-400 shadow-2xl fade-in-up" style={{transitionDelay: '1000ms'}}>
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-full font-bold text-lg shadow-lg flex items-center space-x-2">
                  <Sparkles className="w-5 h-5"/>
                  <span>The Solution</span>
                  <Sparkles className="w-5 h-5"/>
                </div>
                
                <div className="text-center mb-8 mt-4">
                  <h3 className="text-3xl font-bold gradient-text mb-3">All-in-One AI Tutor Platform</h3>
                  <p className="text-gray-700 text-lg">Everything you need, perfectly organized, completely personalized</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-md border border-green-200 text-center transform hover:scale-105 transition-all">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-7 h-7 text-white"/>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Unified Learning Hub</h4>
                    <p className="text-sm text-gray-600">Videos, courses, papers & docs all in one intelligent platform</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-md border border-green-200 text-center transform hover:scale-105 transition-all">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="w-7 h-7 text-white"/>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">Track Every Victory</h4>
                    <p className="text-sm text-gray-600">See your progress, celebrate milestones, stay motivated</p>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl shadow-md border border-green-200 text-center transform hover:scale-105 transition-all">
                    <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-7 h-7 text-white"/>
                    </div>
                    <h4 className="font-bold text-gray-800 mb-2">AI That Understands You</h4>
                    <p className="text-sm text-gray-600">Personalized path that adapts to your pace and preferences</p>
                  </div>
                </div>

                <div className="mt-8 bg-white p-6 rounded-xl border-2 border-green-300">
                  <div className="flex items-center justify-center space-x-4 flex-wrap">
                    <span className="text-gray-700 font-semibold">You stay engaged and active because:</span>
                    <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-600"/>
                      <span className="text-green-700 font-medium">Interactive learning</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-600"/>
                      <span className="text-green-700 font-medium">Clear roadmap</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-600"/>
                      <span className="text-green-700 font-medium">Real progress</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className={`py-24 bg-gray-50 ${isVisible.faq ? 'is-visible' : ''}`}>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 fade-in-up">
                      Frequently Asked Questions
                  </h2>
              </div>
              <div className="space-y-4">
                  {faqs.map((faq, index) => (
                      <div key={index} className={`border bg-white border-gray-200 rounded-lg fade-in-up`} style={{ transitionDelay: `${200 + index * 100}ms` }}>
                          <button onClick={() => setOpenFaq(openFaq === index ? null : index)} className="w-full flex justify-between items-center text-left p-6 font-semibold text-lg text-gray-800 hover:bg-gray-100/50">
                              <span>{faq.q}</span>
                              <ChevronDown className={`w-6 h-6 transform transition-transform duration-300 ${openFaq === index ? 'rotate-180 text-green-600' : 'rotate-0 text-gray-400'}`} />
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                              <p className="p-6 pt-0 text-gray-600 leading-relaxed">{faq.a}</p>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
        </section>


        {/* CTA Section */}
        <section id="cta" className={`py-24 bg-gradient-to-r from-green-600 to-teal-600 ${isVisible.cta ? 'is-visible' : ''}`}>
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white fade-in-up">Ready to Transform Your Learning?</h2>
            <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto fade-in-up" style={{transitionDelay: '200ms'}}>
              Stop struggling and start succeeding. Your personalized path to mastery is just one click away.
            </p>
            <div className="fade-in-up" style={{transitionDelay: '400ms'}}>
                <RedirectButton
                  label="Get Your AI Tutor Now"
                  href="/workspace"
                  variant="secondary"
                  icon="arrow"
                  className="bg-white text-green-600 text-lg px-10 py-5 hover:bg-white/50"
                />
            </div>
             <p className="mt-4 text-sm text-green-200 fade-in-up" style={{transitionDelay: '600ms'}}>7-day free trial. No credit card required.</p>
          </div>
        </section>

      </main>
      
      <footer className="py-12 border-t border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
           <p>&copy; {new Date().getFullYear()} KnowGrow. All rights reserved. Made with ❤️ for the learners of India.</p>
        </div>
      </footer>
    </div>
  );
}

