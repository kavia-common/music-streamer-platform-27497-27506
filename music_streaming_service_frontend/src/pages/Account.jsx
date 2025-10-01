import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button, Badge } from '../components/common';
import { loginSuccess, logout, setSubscription, updateProfile } from '../state/slices/userSlice';
import useAuth from '../hooks/useAuth';
import { createCheckoutSession } from '../api/endpoints';
import { loadStripe } from '@stripe/stripe-js';

/**
 * PUBLIC_INTERFACE
 * Account
 * Shows mock profile/auth state and provides placeholder buttons for OAuth connect and Stripe subscription.
 */
export default function Account() {
  const dispatch = useDispatch();
  const { isAuthenticated, profile, subscriptionStatus } = useSelector((s) => s.user);
  const location = useLocation();
  const { login } = useAuth();

  const [billingMessage, setBillingMessage] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  // Lazy initialize Stripe with public key from env
  const stripePromise = React.useMemo(() => {
    const key = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
    if (!key) {
      // Do not throw; we will render a friendly inline message
      return null;
    }
    try {
      return loadStripe(key);
    } catch (e) {
      console.warn('Stripe initialization failed:', e);
      return null;
    }
  }, []);

  const redirectedMessage = location.state?.message;

  const mockLogin = () => {
    // Use our useAuth login to drive either OAuth or mock, then sync minimal Redux state for UI
    login();
    // For immediate UX in mock mode, also dispatch loginSuccess to reflect profile/subscription locally
    if (!isAuthenticated) {
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
    }
  };

  const mockConnectOAuth = () => {
    // Placeholder for linking additional OAuth provider
    alert('OAuth connect placeholder');
  };

  // Handler to start subscription (checkout)
  const handleSubscribe = async () => {
    setBillingMessage('');
    if (!stripePromise) {
      setBillingMessage('Stripe public key missing. Set REACT_APP_STRIPE_PUBLIC_KEY to enable checkout.');
      return;
    }
    setBusy(true);
    try {
      const { id } = await createCheckoutSession('subscribe');
      const stripe = await stripePromise;
      if (!stripe) {
        setBillingMessage('Stripe failed to initialize. Please refresh and try again.');
        return;
      }
      const result = await stripe.redirectToCheckout({ sessionId: id });
      if (result.error) {
        setBillingMessage(result.error.message || 'Unable to redirect to Stripe Checkout.');
      }
    } catch (e) {
      setBillingMessage(e?.message || 'Failed to create checkout session.');
    } finally {
      setBusy(false);
    }
  };

  // Handler to manage existing subscription (customer portal or similar)
  const handleManageSubscription = async () => {
    setBillingMessage('');
    if (!stripePromise) {
      setBillingMessage('Stripe public key missing. Set REACT_APP_STRIPE_PUBLIC_KEY to enable subscription management.');
      return;
    }
    setBusy(true);
    try {
      const { id } = await createCheckoutSession('manage');
      const stripe = await stripePromise;
      if (!stripe) {
        setBillingMessage('Stripe failed to initialize. Please refresh and try again.');
        return;
      }
      const result = await stripe.redirectToCheckout({ sessionId: id });
      if (result.error) {
        setBillingMessage(result.error.message || 'Unable to redirect to Stripe.');
      }
    } catch (e) {
      setBillingMessage(e?.message || 'Failed to initiate subscription management.');
    } finally {
      setBusy(false);
    }
  };

  const saveProfile = () => {
    dispatch(updateProfile({ name: 'Oceanic Listener' }));
  };

  return (
    <div className="container" style={{ paddingTop: 0 }}>
      {redirectedMessage ? (
        <div className="surface" role="status" style={{ padding: '.75rem 1rem', marginBottom: '0.75rem', borderLeft: '4px solid var(--color-primary)' }}>
          {redirectedMessage}
        </div>
      ) : null}

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
            <Button onClick={mockLogin} leftIcon="🔑">Sign in</Button>
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
          <Button onClick={handleSubscribe} leftIcon="💳" loading={busy}>Subscribe</Button>
          <Button variant="secondary" onClick={handleManageSubscription} leftIcon="🧾" disabled={busy}>Manage Subscription</Button>
          <Button variant="ghost" onClick={() => dispatch(setSubscription('free'))} leftIcon="↩️" disabled={busy}>Set Free</Button>
          <Button variant="ghost" onClick={() => dispatch(setSubscription('premium'))} leftIcon="⭐" disabled={busy}>Set Premium</Button>
        </div>
        {(!process.env.REACT_APP_STRIPE_PUBLIC_KEY) ? (
          <div className="text-muted" style={{ marginTop: '.75rem' }}>
            Stripe is in placeholder mode. Set REACT_APP_STRIPE_PUBLIC_KEY to enable Checkout redirect.
          </div>
        ) : null}
        {billingMessage ? (
          <div role="alert" className="o-field__error" style={{ marginTop: '.5rem' }}>
            {billingMessage}
          </div>
        ) : null}
      </section>
    </div>
  );
}
