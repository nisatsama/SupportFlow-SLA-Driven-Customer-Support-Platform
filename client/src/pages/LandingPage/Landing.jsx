import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">
          Help<span>Desk</span>
        </div>

        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#about">About</a>

          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="register-btn">
            Register
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <div className="badge">🎫 Smart • Simple • Fast Support</div>

          <h1>
            Get Your Issues
            <span> Resolved Faster.</span>
          </h1>

          <p>
            A centralized help desk platform where you can raise support
            tickets, track their progress, communicate with support teams, and
            get your issues resolved efficiently.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Get Started →
            </Link>

            <Link to="/login" className="secondary-btn">
              Already have an account?
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>24/7</strong>
              <span>Support Tracking</span>
            </div>

            <div>
              <strong>100%</strong>
              <span>Ticket Visibility</span>
            </div>

            <div>
              <strong>Fast</strong>
              <span>Issue Resolution</span>
            </div>
          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="hero-visual">
          <div className="dashboard-card">
            <div className="dashboard-header">
              <div>
                <span className="small-text">Welcome back</span>
                <h3>Support Dashboard</h3>
              </div>

              <div className="avatar">N</div>
            </div>

            <div className="ticket-summary">
              <div className="summary-card">
                <div className="summary-icon blue">🎫</div>
                <div>
                  <span>Open Tickets</span>
                  <strong>12</strong>
                </div>
              </div>

              <div className="summary-card">
                <div className="summary-icon green">✓</div>
                <div>
                  <span>Resolved</span>
                  <strong>48</strong>
                </div>
              </div>
            </div>

            <div className="recent-tickets">
              <div className="section-title">
                <span>Recent Tickets</span>
                <span className="view-all">View all</span>
              </div>

              <div className="ticket">
                <div className="ticket-icon">💻</div>

                <div className="ticket-info">
                  <strong>Unable to access account</strong>
                  <span>#HD-1024 • IT Department</span>
                </div>

                <span className="status pending">Pending</span>
              </div>

              <div className="ticket">
                <div className="ticket-icon">🔐</div>

                <div className="ticket-info">
                  <strong>Password reset request</strong>
                  <span>#HD-1023 • Account</span>
                </div>

                <span className="status resolved">Resolved</span>
              </div>

              <div className="ticket">
                <div className="ticket-icon">🌐</div>

                <div className="ticket-info">
                  <strong>Network connectivity issue</strong>
                  <span>#HD-1022 • Network</span>
                </div>

                <span className="status progress">In Progress</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features" id="features">
        <div className="section-heading">
          <span>POWERFUL FEATURES</span>
          <h2>Everything you need for better support.</h2>
          <p>Manage support requests from one simple and organized platform.</p>
        </div>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">🎫</div>
            <h3>Create Tickets</h3>
            <p>
              Easily create support tickets and describe your issue in detail.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Track Progress</h3>
            <p>
              Monitor your tickets and know exactly what is happening with your
              request.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>Communicate</h3>
            <p>
              Stay connected with support staff through ticket conversations.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Faster Resolution</h3>
            <p>Help support teams prioritize and resolve issues efficiently.</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-it-works" id="how-it-works">
        <div className="section-heading">
          <span>HOW IT WORKS</span>
          <h2>Get help in three simple steps.</h2>
        </div>

        <div className="steps">
          <div className="step">
            <div className="step-number">01</div>
            <h3>Create an Account</h3>
            <p>Register on the platform and create your support profile.</p>
          </div>

          <div className="step">
            <div className="step-number">02</div>
            <h3>Raise a Ticket</h3>
            <p>Tell us about your issue and submit a support request.</p>
          </div>

          <div className="step">
            <div className="step-number">03</div>
            <h3>Get It Resolved</h3>
            <p>Track your ticket while our support team works on your issue.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta" id="about">
        <h2>Need help with something?</h2>

        <p>
          Don't let technical problems slow you down. Raise a ticket and let our
          support team handle it.
        </p>

        <Link to="/register" className="primary-btn">
          Create Your Account →
        </Link>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">
          Help<span>Desk</span>
        </div>

        <p>© 2026 HelpDesk. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Landing;
