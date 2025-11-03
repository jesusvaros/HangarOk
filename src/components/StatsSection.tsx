import React, { useEffect, useState } from 'react';
import { fetchSiteStats, type SiteStats } from '../services/stats';

const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<SiteStats | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetchSiteStats().then((data) => {
      if (isMounted) {
        setStats(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h2 className="mb-8 text-3xl font-bold">Our metrics</h2>
        {stats ? (
          <dl className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div>
              <dt className="text-4xl font-extrabold text-blue-600">{stats.totalReviews}</dt>
              <dd className="mt-2 text-lg text-gray-600">Public reviews</dd>
            </div>
            <div>
              <dt className="text-4xl font-extrabold text-blue-600">{stats.verifiedLandlords}</dt>
              <dd className="mt-2 text-lg text-gray-600">Verified landlords</dd>
            </div>
            <div>
              <dt className="text-4xl font-extrabold text-blue-600">{stats.cities}</dt>
              <dd className="mt-2 text-lg text-gray-600">Cities</dd>
            </div>
          </dl>
        ) : (
          <p className="text-gray-600">Loading...</p>
        )}
      </div>
    </section>
  );
};

export default StatsSection;
