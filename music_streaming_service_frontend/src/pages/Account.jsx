import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Badge } from '../components/common';
import { loginSuccess, logout, setSubscription, updateProfile } from '../state/slices/userSlice';

/**
 * PUBLIC_INTERFACE
 * Account
 * Shows mock profile/auth state and provides placeholder buttons for OAuth connect and Stripe subscription.
 */
export default function Account() {
  const dispatch = useDispatch();
  const { isAuthenticated, profile, subscriptionStatus } = useSelector((s) => s.user);

  const mockLogin = () => {
    dispatch(
      loginSuccess({
        profile: {
          id: 'u1',
          name: 'Ocean User',
          email: 'user@example.com',
          avatarUrl: '',
        },
        subscriptionStatus: 'trial',
      })
    );
  };

  const mockConnectOAuth = () => {
    // Placeholder for linking additional OAuth provider
    alert('OAuth connect placeholder');
  };

  const mockStripeCheckout = () => {
    // Placeholder: would call backend to create a Stripe session, then redirect
    alert('Stripe checkout placeholder');
  };

  const saveProfile = () => {
    dispatch(updateProfile({ name: 'Oceanic Listener' }));
  };

  return (
    <div className="container" style={{ paddingTop: 0 }}>
      <section className="card shadow-hover" aria-labelledby="acct-title">
        <h2 id="acct-title" style={{ marginTop: 0 }}>Account</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div aria-hidden="true" style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(37,99,235,0.12)' }} />
          <div>
            <div style={{ fontWeight: 700 }}>{isAuthenticated ? (profile?.name || 'User') : 'Guest'}</div>
            <div className="text-muted">{isAuthenticated ? profile?.email : 'Not signed in'}</div>
            <div style={{ marginTop: '.35rem' }}>
              <Badge variant={subscriptionStatus === 'premium' ? 'success' : subscriptionStatus === 'trial' ? 'info' : 'neutral'}>
                {subscriptionStatus}
              </Badge>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '.5rem', marginTop: '.75rem', flexWrap: 'wrap' }}>
          {!isAuthenticated ? (
            <Button onClick={mockLogin} leftIcon="🔑">Sign in (Mock)</Button>
          ) : (
            <>
              <Button variant="secondary" onClick={mockConnectOAuth} leftIcon="🔗">Connect OAuth</Button>
              <Button variant="secondary" onClick={saveProfile} leftIcon="💾">Save Profile</Button>
              <Button variant="ghost" onClick={() => dispatch(logout())} leftIcon="🚪">Sign out</Button>
            </>
          )}
        </div>
      </section>

      <section className="card" style={{ marginTop: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Subscription</h3>
        <p className="text-muted">Upgrade to Premium for ad-free listening and downloads.</p>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <Button onClick={mockStripeCheckout} leftIcon="💳">Upgrade with Stripe (Mock)</Button>
          <Button variant="ghost" onClick={() => dispatch(setSubscription('free'))} leftIcon="↩️">Set Free</Button>
          <Button variant="ghost" onClick={() => dispatch(setSubscription('premium'))} leftIcon="⭐">Set Premium</Button>
        </div>
      </section>
    </div>
  );
}
