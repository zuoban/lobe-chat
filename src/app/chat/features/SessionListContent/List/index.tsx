import { Empty } from 'antd';
import { createStyles, useResponsive } from 'antd-style';
import Link from 'next/link';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Center } from 'react-layout-kit';
import LazyLoad from 'react-lazy-load';

import { SESSION_CHAT_URL } from '@/const/url';
import { featureFlagsSelectors, useFeatureFlagStore } from '@/store/featureFlags';
import { useSessionStore } from '@/store/session';
import { sessionSelectors } from '@/store/session/selectors';
import { LobeAgentSession } from '@/types/session';

import SkeletonList from '../SkeletonList';
import AddButton from './AddButton';
import SessionItem from './Item';

const useStyles = createStyles(
  ({ css }) => css`
    min-height: 70px;
  `,
);

interface SessionListProps {
  dataSource?: LobeAgentSession[];
  groupId?: string;
  showAddButton?: boolean;
}
const SessionList = memo<SessionListProps>(({ dataSource, groupId, showAddButton = true }) => {
  const { t } = useTranslation('chat');
  const isInit = useSessionStore((s) => sessionSelectors.isSessionListInit(s));
  const { showCreateSession } = useFeatureFlagStore(featureFlagsSelectors);
  const { styles } = useStyles();

  const { mobile } = useResponsive();

  const isEmpty = !dataSource || dataSource.length === 0;
  return !isInit ? (
    <SkeletonList />
  ) : !isEmpty ? (
    dataSource.map(({ id }) => (
      <LazyLoad className={styles} key={id}>
        <Link aria-label={id} href={SESSION_CHAT_URL(id, mobile)}>
          <SessionItem id={id} />
        </Link>
      </LazyLoad>
    ))
  ) : showCreateSession ? (
    showAddButton && <AddButton groupId={groupId} />
  ) : (
    <Center>
      <Empty description={t('emptyAgent')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
    </Center>
  );
});

export default SessionList;
