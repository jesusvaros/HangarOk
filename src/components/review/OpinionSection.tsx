import React from 'react';
import { ChatBubbleLeftRightIcon, HomeIcon, UserGroupIcon, UserIcon, StarIcon as StarIconOutline } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

interface OpinionSectionProps {
  propertyOpinion?: string;
  communityOpinion?: string;
  ownerOpinion?: string;
  wouldRecommend?: '1'|'2'|'3'|'4'|'5';
  showHeader?: boolean;
}

const OpinionSection: React.FC<OpinionSectionProps> = ({
  propertyOpinion,
  communityOpinion,
  ownerOpinion,
  wouldRecommend,
  showHeader = true,
}) => {
  const hasOpinions = propertyOpinion || communityOpinion || ownerOpinion;

  if (!hasOpinions) {
    return null;
  }

  return (
    <div className="space-y-6 text-[16px]">
      {showHeader && (
        <div className="flex items-center gap-2 mb-2">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-700" />
          <h3 className="text-[18px] font-semibold">Opinions</h3>
          {wouldRecommend && (
            <div className="ml-3 flex items-center" aria-label={`Recommendation ${wouldRecommend} out of 5`}>
              {[1,2,3,4,5].map((i) => (
                <span key={i} className="mr-0.5">
                  {i <= Number(wouldRecommend) ? (
                    <StarIconSolid className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <StarIconOutline className="h-5 w-5 text-gray-300" />
                  )}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {propertyOpinion && (
        <div className="border-l-4 border-green-200 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <HomeIcon className="h-5 w-5 text-green-600" />
            <h4 className="text-[16px] font-medium">About the home</h4>
          </div>
          <p className="text-gray-700 whitespace-pre-line">{propertyOpinion}</p>
        </div>
      )}

      {communityOpinion && (
        <div className="border-l-4 border-green-200 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <UserGroupIcon className="h-5 w-5 text-green-600" />
            <h4 className="text-[16px] font-medium">About the community</h4>
          </div>
          <p className="text-gray-700 whitespace-pre-line">{communityOpinion}</p>
        </div>
      )}

      {ownerOpinion && (
        <div className="border-l-4 border-green-200 pl-4">
          <div className="flex items-center gap-2 mb-2">
            <UserIcon className="h-5 w-5 text-green-600" />
            <h4 className="text-[16px] font-medium">
              About {ownerOpinion.toLowerCase().includes('agencia') ? 'the agency' : 'the landlord'}
            </h4>
          </div>
          <p className="text-gray-700 whitespace-pre-line">{ownerOpinion}</p>
        </div>
      )}
    </div>
  );
};

export default OpinionSection;
