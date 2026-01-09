const ReviewNightRewards = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="mb-8 text-3xl md:text-4xl font-bold text-[#232C17]">
            A thank you to the riders who take part
          </h2>
          
          <p className="mb-12 text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            After each Review Night, three participants are selected at random.
          </p>
          
          <div className="bg-gradient-to-r from-[#4A5E32] to-[#5A6E42] text-white p-8 rounded-lg max-w-3xl mx-auto mb-12">
            <p className="text-lg leading-relaxed">
              They're invited to join one of HangarOK's supported riding experiences — designed to celebrate cycling, build community, and shape what HangarOK becomes next.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 max-w-2xl mx-auto">
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="w-5 h-5 text-[#4A5E32]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Celebrate cycling</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="w-5 h-5 text-[#4A5E32]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
              <span className="font-medium">Build community</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <svg className="w-5 h-5 text-[#4A5E32]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Shape HangarOK's future</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewNightRewards;
