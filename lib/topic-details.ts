// 상세 원고는 정적 페이지 생성 시에만 사용한다. 홈 검색에서는 가져오지 않는다.
import { geometryDetails } from './details/geometry.ts';
import { logicDetails } from './details/logic.ts';
import { functionDetails } from './details/functions.ts';
import type { DetailMap } from './details/types.ts';

export const topicDetails: DetailMap = {
  ...geometryDetails,
  ...logicDetails,
  ...functionDetails,
};
export function findTopicDetail(
  unitId: string,
  subunitId: string,
  topicId: string,
) {
  return topicDetails[[unitId, subunitId, topicId].join('/')];
}
