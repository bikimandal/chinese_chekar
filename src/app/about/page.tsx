export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="bg-gradient-to-r from-amber-600/20 to-orange-600/20 backdrop-blur-sm border-b border-amber-500/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 text-center">
            About Us
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-slate-300 text-center max-w-2xl mx-auto">
            Learn more about our mission and values
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-slate-700/50 p-6 sm:p-8 md:p-12">
            <p className="text-sm sm:text-base md:text-lg text-slate-300 leading-relaxed">
              This is the about page content. We are passionate about delivering authentic Chinese cuisine with the finest ingredients and traditional cooking methods.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
