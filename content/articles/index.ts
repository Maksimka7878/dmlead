import { Article } from '../types';
import { buildCoreArticles } from './core';
import { buildCityArticles } from './cities';
import { buildSegmentArticles } from './segments';
import { buildAudienceArticles } from './audiences';
import { buildChannelArticles } from './channels';
import { buildMetricArticles } from './metrics';
import { buildManagementArticles } from './management';
import { buildOperationsArticles } from './operations';
import { buildGlossaryArticles } from './glossary';
import { buildQuestionArticles } from './questions';

/** Все статьи блога. Модули добавляются батчами и агрегируются здесь. */
export const buildArticles = (): Article[] => [
  ...buildCoreArticles(),
  ...buildCityArticles(),
  ...buildSegmentArticles(),
  ...buildAudienceArticles(),
  ...buildChannelArticles(),
  ...buildMetricArticles(),
  ...buildManagementArticles(),
  ...buildOperationsArticles(),
  ...buildGlossaryArticles(),
  ...buildQuestionArticles(),
];
