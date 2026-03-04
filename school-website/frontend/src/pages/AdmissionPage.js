/* eslint-disable */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { API } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';

const steps = ['Personal Info', 'Academic Info', 'Parent/Guardian', 'Review & Submit'];

const AdmissionPage = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [appId, setAppId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    applicantName: '', email: '', phone: '', dateOfBirth: '',
    gender: '', address: '', bloodGroup: '',
    previousSchool: '', applyingForClass: '', hobbies: '',
    parentName: '', parentPhone: '', parentEmail: '', parentOccupation: ''
  });

  const update = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const requirements = [
    '✅ Birth Certificate (original + photocopy)',
    '✅ Previous School Report Card (last 2 years)',
    '✅ Transfer Certificate from previous school',
    '✅ 4 recent passport-size photographs',
    '✅ National ID of parent/guardian',
    '✅ Medical fitness certificate'
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await API.post('/admissions/apply', form);
      setAppId(res.data.id);
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <>
        <Navbar />
        <div className="form-page" style={{ minHeight: 'calc(100vh - 72px)' }}>
          <div className="form-card" style={{ maxWidth: 560, textAlign: 'center' }}>
            <div style={{ fontSize: 80, marginBottom: 16 }}>🎉</div>
            <h2 style={{ color: 'var(--teal)', marginBottom: 12 }}>Application Submitted!</h2>
            <p style={{ color: 'var(--gray-500)', fontSize: 16, lineHeight: 1.7, marginBottom: 24 }}>
              Your admission application has been received successfully. Our admissions team will review your application and contact you within <strong>5–7 business days</strong>.
            </p>
            <div style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>Application Reference Number</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--navy)', fontFamily: 'Playfair Display, serif' }}>
                GA-2024-{String(appId).padStart(5, '0')}
              </div>
              <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>Please keep this for your records</div>
            </div>
            <div style={{ marginBottom: 24, textAlign: 'left' }}>
              <h4 style={{ marginBottom: 12, color: 'var(--navy)' }}>What happens next?</h4>
              {['Application review by admissions committee (3–5 days)', 'Shortlisted candidates invited for entrance test', 'Personal interview with student and parents', 'Final admission decision communicated'].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                  <span style={{ background: 'var(--gold)', color: 'var(--navy)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                  <span style={{ color: 'var(--gray-700)', fontSize: 14 }}>{s}</span>
                </div>
              ))}
            </div>
            <Link to="/" className="btn-primary" style={{ justifyContent: 'center' }}>← Back to Home</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="form-page" style={{ minHeight: 'calc(100vh - 72px)' }}>
        <div className="form-card">
          <div className="form-header">
            <div style={{ fontSize: 40, marginBottom: 8 }}>📋</div>
            <h2>Admission Application 2025–26</h2>
            <p>Complete all steps to submit your application. Fields marked * are required.</p>
          </div>

          {/* Step indicator */}
          <div className="step-indicator">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className={`step ${i < step ? 'done' : i === step ? 'active' : ''}`}>
                  {i < step ? '✓' : i + 1}
                </div>
                {i < steps.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          <div style={{ fontSize: 13, color: 'var(--gray-500)', textAlign: 'center', marginBottom: 28 }}>
            Step {step + 1} of {steps.length}: <strong style={{ color: 'var(--navy)' }}>{steps[step]}</strong>
          </div>

          {/* Step 0 */}
          {step === 0 && (
            <div className="form-grid">
              <div className="form-group full">
                <label>Full Name *</label>
                <input placeholder="Enter full name" value={form.applicantName} onChange={e => update('applicantName', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input placeholder="+880 1XXXXXXXXX" value={form.phone} onChange={e => update('phone', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input type="date" value={form.dateOfBirth} onChange={e => update('dateOfBirth', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select value={form.gender} onChange={e => update('gender', e.target.value)}>
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select value={form.bloodGroup} onChange={e => update('bloodGroup', e.target.value)}>
                  <option value="">Select blood group</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
              <div className="form-group full">
                <label>Home Address *</label>
                <textarea placeholder="Full address including street, area, city" value={form.address} onChange={e => update('address', e.target.value)} required />
              </div>
            </div>
          )}

          {/* Step 1 */}
          {step === 1 && (
            <div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Applying for Class *</label>
                  <select value={form.applyingForClass} onChange={e => update('applyingForClass', e.target.value)}>
                    <option value="">Select class</option>
                    {['Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11 (Science)', 'Class 11 (Commerce)', 'Class 11 (Humanities)', 'Class 12 (Science)', 'Class 12 (Commerce)', 'Class 12 (Humanities)'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Previous School</label>
                  <input placeholder="Name of previous school" value={form.previousSchool} onChange={e => update('previousSchool', e.target.value)} />
                </div>
                <div className="form-group full">
                  <label>Hobbies & Extracurricular Activities</label>
                  <textarea placeholder="Sports, music, arts, etc." value={form.hobbies} onChange={e => update('hobbies', e.target.value)} />
                </div>
              </div>

              <div style={{ marginTop: 28, background: 'var(--gray-50)', borderRadius: 12, padding: 24 }}>
                <h4 style={{ marginBottom: 16, color: 'var(--navy)' }}>📂 Required Documents at Admission</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {requirements.map((r, i) => (
                    <div key={i} style={{ fontSize: 14, color: 'var(--gray-700)' }}>{r}</div>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 12 }}>
                  Note: Physical documents will be required at the time of admission. You may upload scanned copies during the interview process.
                </p>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="form-grid">
              <div className="form-group full">
                <label>Parent / Guardian Name *</label>
                <input placeholder="Full name" value={form.parentName} onChange={e => update('parentName', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Parent Phone *</label>
                <input placeholder="+880 1XXXXXXXXX" value={form.parentPhone} onChange={e => update('parentPhone', e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Parent Email</label>
                <input type="email" placeholder="parent@email.com" value={form.parentEmail} onChange={e => update('parentEmail', e.target.value)} />
              </div>
              <div className="form-group full">
                <label>Parent Occupation</label>
                <input placeholder="e.g. Doctor, Engineer, Business" value={form.parentOccupation} onChange={e => update('parentOccupation', e.target.value)} />
              </div>
            </div>
          )}

          {/* Step 3 - Review */}
          {step === 3 && (
            <div>
              <h3 style={{ marginBottom: 20, color: 'var(--navy)' }}>Please Review Your Application</h3>
              {[
                { title: '👤 Personal Information', fields: [
                  ['Full Name', form.applicantName], ['Email', form.email], ['Phone', form.phone],
                  ['Date of Birth', form.dateOfBirth], ['Gender', form.gender], ['Blood Group', form.bloodGroup || '—'],
                  ['Address', form.address]
                ]},
                { title: '🎓 Academic Information', fields: [
                  ['Applying for Class', form.applyingForClass], ['Previous School', form.previousSchool || '—'],
                  ['Hobbies', form.hobbies || '—']
                ]},
                { title: '👨‍👩‍👦 Parent / Guardian', fields: [
                  ['Parent Name', form.parentName], ['Parent Phone', form.parentPhone],
                  ['Parent Email', form.parentEmail || '—'], ['Occupation', form.parentOccupation || '—']
                ]}
              ].map((section, si) => (
                <div key={si} style={{ background: 'var(--gray-50)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                  <h4 style={{ marginBottom: 12, color: 'var(--navy)' }}>{section.title}</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {section.fields.map(([label, val]) => (
                      <div key={label}>
                        <div style={{ fontSize: 12, color: 'var(--gray-500)', fontWeight: 600 }}>{label}</div>
                        <div style={{ fontSize: 14, color: 'var(--navy)', marginTop: 2 }}>{val || '—'}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <div style={{ background: 'rgba(232,184,75,0.1)', border: '1px solid rgba(232,184,75,0.3)', borderRadius: 10, padding: 16, marginTop: 8 }}>
                <p style={{ fontSize: 13, color: 'var(--gray-700)' }}>
                  ⚠️ By submitting this application, I confirm that all information provided is accurate and complete. I understand that any false information may result in cancellation of admission.
                </p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--gray-200)' }}>
            <button
              onClick={() => step > 0 ? setStep(step - 1) : null}
              disabled={step === 0}
              className="btn-secondary"
              style={{ opacity: step === 0 ? 0.3 : 1 }}
            >
              ← Previous
            </button>
            {step < steps.length - 1 ? (
              <button onClick={() => setStep(step + 1)} className="btn-primary">
                Next Step →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading} className="btn-primary" style={{ background: 'linear-gradient(135deg, var(--teal), #16a085)' }}>
                {loading ? 'Submitting...' : '🎯 Submit Application'}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdmissionPage;
