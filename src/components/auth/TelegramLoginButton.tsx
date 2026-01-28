'use client';

import { useEffect, useRef } from 'react';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginButtonProps {
  botName: string;
  onAuth: (user: TelegramUser) => void;
  cornerRadius?: number;
  requestAccess?: boolean;
  usePic?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export function TelegramLoginButton({
  botName,
  onAuth,
  cornerRadius = 8,
  requestAccess = true,
  usePic = true,
  size = 'large',
}: TelegramLoginButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // @ts-ignore
    window.onTelegramAuth = (user: TelegramUser) => {
      onAuth(user);
    };

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.setAttribute('data-telegram-login', botName);
    script.setAttribute('data-size', size);
    script.setAttribute('data-radius', cornerRadius.toString());
    script.setAttribute('data-request-access', requestAccess ? 'write' : '');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.async = true;

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [botName, onAuth, cornerRadius, requestAccess, size]);

  return <div ref={containerRef} id="telegram-login-container" />;
}
