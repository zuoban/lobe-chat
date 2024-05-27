import { Icon } from '@lobehub/ui';
import { Button, Input } from 'antd';
import { Network } from 'lucide-react';
import { ReactNode, memo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useUserStore } from '@/store/user';
import { keyVaultsConfigSelectors } from '@/store/user/selectors';
import { GlobalLLMProviderKey } from '@/types/user/settings';

import { FormAction } from '../style';

interface ProviderApiKeyFormProps {
  apiKeyPlaceholder?: string;
  avatar?: ReactNode;
  provider: GlobalLLMProviderKey;
  showEndpoint?: boolean;
}

const ProviderApiKeyForm = memo<ProviderApiKeyFormProps>(
  ({ provider, avatar, showEndpoint = false, apiKeyPlaceholder }) => {
    const { t } = useTranslation('modelProvider');
    const { t: errorT } = useTranslation('error');
    const [showProxy, setShow] = useState(false);

    const [apiKey, proxyUrl, setConfig] = useUserStore((s) => [
      keyVaultsConfigSelectors.getVaultByProvider(provider)(s)?.apiKey,
      keyVaultsConfigSelectors.getVaultByProvider(provider)(s)?.baseURL,
      s.updateKeyVaultConfig,
    ]);

    return (
      <FormAction
        avatar={avatar}
        description={t(`${provider}.unlock.description` as any)}
        title={t(`${provider}.unlock.title` as any)}
      >
        <Input.Password
          autoComplete={'new-password'}
          onChange={(e) => {
            setConfig(provider, { apiKey: e.target.value });
          }}
          placeholder={apiKeyPlaceholder || 'sk-***********************'}
          type={'block'}
          value={apiKey}
        />
        {showEndpoint &&
          (showProxy ? (
            <Input
              onChange={(e) => {
                setConfig(provider, { endpoint: e.target.value });
              }}
              placeholder={'https://api.openai.com/v1'}
              type={'block'}
              value={proxyUrl}
            />
          ) : (
            <Button
              icon={<Icon icon={Network} />}
              onClick={() => {
                setShow(true);
              }}
              type={'text'}
            >
              {errorT('unlock.addProxyUrl')}
            </Button>
          ))}
      </FormAction>
    );
  },
);

export default ProviderApiKeyForm;
