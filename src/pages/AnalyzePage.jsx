import { useState, useRef } from 'react';
import Button      from '../components/ui/Button';
import Card        from '../components/ui/Card';
import Spinner     from '../components/ui/Spinner';
import { useApp }  from '../context/AppContext';
import { analyzeTestImage, callAI } from '../hooks/useAPI';
import { addHistory } from '../hooks/authAPI';
import { C }       from '../assets/theme';

// ── STEP 1: Upload ────────────────────────────────────────────────────────────
function UploadStep({ onAnalyzed, L }) {
  const { setAnalyzePage } = useApp();
  const [preview,  setPreview]  = useState(null);
  const [fileData, setFileData] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFile = file => {
    if (!file) return;
    const mt = ['image/jpeg','image/jpg','image/png','image/webp'].includes(file.type)
      ? file.type : 'image/jpeg';
    const r = new FileReader();
    r.onload = e => {
      setPreview(e.target.result);
      setFileData({ b64: e.target.result.split(',')[1], mediaType: mt });
    };
    r.readAsDataURL(file);
  };

  const pickImage = (cam = false) => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    if (cam) inp.capture = 'environment';
    inp.onchange = e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); };
    inp.click();
  };

  const analyze = async () => {
    if (!fileData || loading) return;
    setLoading(true); setProgress(0);
    const timer = setInterval(() => setProgress(p => Math.min(p + 8, 90)), 300);
    const result = await analyzeTestImage(fileData.b64, fileData.mediaType);
    clearInterval(timer); setProgress(100);
    setTimeout(() => { setLoading(false); onAnalyzed(result, preview); }, 400);
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', background: C.bg }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${C.pl},${C.pd})`, padding: '16px 20px 22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => setAnalyzePage(false)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: 10,
              width: 36, height: 36, cursor: 'pointer', color: '#fff', fontSize: 20,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>‹</button>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>{L.uploadTitle}</h2>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.8)' }}>{L.uploadSub}</p>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Drop zone */}
        <div onClick={() => !preview && !loading && pickImage()}
          style={{ border: `2.5px dashed ${preview ? '#10B981' : loading ? C.pl : '#C7D2FE'}`,
            borderRadius: 22,
            background: preview ? '#F0FDF4' : loading ? '#EEF2FF' : C.white,
            cursor: preview || loading ? 'default' : 'pointer',
            overflow: 'hidden', minHeight: 220,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {preview ? (
            <div style={{ position: 'relative', width: '100%' }}>
              <img src={preview} alt="test"
                style={{ width: '100%', maxHeight: 300, objectFit: 'cover', display: 'block' }} />
              {!loading && (
                <button onClick={e => { e.stopPropagation(); setPreview(null); setFileData(null); setProgress(0); }}
                  style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.6)',
                    border: 'none', borderRadius: 9, color: '#fff', width: 34, height: 34,
                    cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ✕
                </button>
              )}
              {loading ? (
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(99,102,241,0.7)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                  <div style={{ fontSize: 40 }}>🔍</div>
                  <p style={{ margin: 0, color: '#fff', fontWeight: 700, fontSize: 15 }}>{L.analyzing}</p>
                  <div style={{ width: '70%', height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.3)' }}>
                    <div style={{ width: `${progress}%`, height: '100%', borderRadius: 3,
                      background: '#fff', transition: 'width 0.3s' }} />
                  </div>
                  <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: 12 }}>{progress}%</p>
                </div>
              ) : (
                <div style={{ position: 'absolute', bottom: 10, left: 10,
                  background: 'rgba(16,185,129,0.9)', borderRadius: 9,
                  padding: '5px 12px', fontSize: 12, fontWeight: 700, color: '#fff' }}>
                  {L.imgReady}
                </div>
              )}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '36px 20px' }}>
              <div style={{ fontSize: 56, marginBottom: 14 }}>📋</div>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>{L.dropText}</p>
              <p style={{ margin: '6px 0 0', fontSize: 12, color: C.sub }}>{L.dropSub}</p>
            </div>
          )}
        </div>

        {/* Camera / Gallery buttons */}
        {!preview && !loading && (
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ label: L.camBtn, cam: true }, { label: L.galBtn, cam: false }].map(({ label, cam }) => (
              <button key={label} onClick={() => pickImage(cam)}
                style={{ flex: 1, padding: '14px', borderRadius: 14, background: C.white,
                  border: `1.5px solid ${C.border}`, fontSize: 13, fontWeight: 700, color: C.text,
                  cursor: 'pointer', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                {label}
              </button>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          <Button onClick={analyze} disabled={!preview || loading}>
            {loading ? <><Spinner /> {L.analyzingBtn} ({progress}%)...</> : L.analyzeBtn}
          </Button>
        </div>

        {/* Tip */}
        <div style={{ background: '#EEF2FF', borderRadius: 14, padding: '12px 14px' }}>
          <p style={{ margin: '0 0 6px', fontSize: 12, fontWeight: 700, color: C.primary }}>{L.tipTitle}</p>
          <p style={{ margin: 0, fontSize: 11.5, color: C.sub, lineHeight: 1.6 }}>{L.tipText}</p>
        </div>
      </div>
    </div>
  );
}


function ResultStep({ result, onBack, L }) {
  const sc  = result.score;
  const col = sc >= 70 ? C.success : sc >= 50 ? C.warn : C.danger;
  const lbl = sc >= 70 ? L.scoreGreat : sc >= 50 ? L.scoreGood : sc >= 30 ? L.scoreMid : L.scoreBad;
  const { lang } = useApp();
  const [aiTeaching, setAiTeaching] = useState({});
  const [loadingAI, setLoadingAI] = useState({});

  const teachTopic = async (topic, questionNumber) => {
    if (loadingAI[questionNumber]) return;
    setLoadingAI(prev => ({ ...prev, [questionNumber]: true }));

    const prompt = `${topic} mavzusida xato qilgansiz. Bu mavzuni tushuntirib bering va qanday o'rganish kerakligini ayting.`;
    const messages = [{ role: 'user', content: prompt }];
    let response = await callAI(messages, `Siz ${result.subject} fanidan o'qituvchisiz. O'quvchi xato qilgan mavzuni tushuntiring.`);

    // Agar AI ishlamasa, demo dars bering
    if (response === 'Xatolik.' || response === "AI kalit yo'q." || response.includes('kalit')) {
      response = `📚 ${topic} mavzusi haqida:\n\nBu mavzu ${result.subject} fanining muhim qismidir. Siz bu yerda xato qildingiz:\n• Asosiy tushunchani o'zlashtirish kerak\n• Amaliy mashqlar orqali mashq qilish zarur\n• Namunalarni o'rganib, talab qilish lozim\n\nKuchli bo'lish uchun:\n1. Dars materialni qayta o'qib chiqing\n2. Shunga o'xshash masalalarni yeching\n3. Keyin qayta test ishing`;
    }

    setAiTeaching(prev => ({ ...prev, [questionNumber]: response }));
    setLoadingAI(prev => ({ ...prev, [questionNumber]: false }));
  };

  return (
    <div style={{ flex: 1, overflow: 'auto', background: C.bg }}>
      <div style={{ background: `linear-gradient(135deg,${col},${col}CC)`, padding: '22px 20px 28px' }}>
        <button onClick={onBack}
          style={{ background: 'rgba(255,255,255,0.22)', border: 'none', borderRadius: 10,
            color: '#fff', fontSize: 13, fontWeight: 700, padding: '7px 14px',
            cursor: 'pointer', marginBottom: 16, fontFamily: 'inherit' }}>
          {L.backBtn}
        </button>
        <p style={{ margin: '0 0 6px', fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
          {result.subject} · {L.resultSub}
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
              <span style={{ fontSize: 60, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{sc}</span>
              <span style={{ fontSize: 24, color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>%</span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 14, fontWeight: 700, color: '#fff' }}>{lbl}</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[
              { v: (result.totalQuestions||0) - (result.wrongAnswers?.length||0), l: L.correctLbl },
              { v: result.wrongAnswers?.length || 0, l: L.wrongLbl },
            ].map(x => (
              <div key={x.l} style={{ textAlign: 'center', background: 'rgba(255,255,255,0.22)',
                borderRadius: 14, padding: '12px 18px' }}>
                <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#fff' }}>{x.v}</p>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>{x.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* AI Summary */}
        <Card style={{ background: 'linear-gradient(135deg,#EEF2FF,#E0E7FF)',
          border: '1px solid #C7D2FE', marginBottom: 14, padding: '16px' }}>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9,
              background: `linear-gradient(135deg,${C.pl},#3B82F6)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🤖</div>
            <span style={{ fontSize: 13, fontWeight: 700, color: C.primary }}>{L.aiSummary}</span>
          </div>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.65, color: C.text }}>{result.summary}</p>
        </Card>

        {/* Wrong answers */}
        {result.wrongAnswers?.length > 0 && (
          <>
            <h3 style={{ margin: '0 0 12px', fontSize: 15, fontWeight: 700, color: C.text }}>
              {L.wrongTitle} ({result.wrongAnswers.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
              {result.wrongAnswers.map((w, i) => (
                <Card key={i} style={{ border: '1.5px solid #FECACA', padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
                    <div style={{ width: 30, height: 30, borderRadius: 9, background: '#FEE2E2',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, color: '#B91C1C', flexShrink: 0 }}>
                      {w.questionNumber}
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{w.topic}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 7, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, padding: '5px 12px', borderRadius: 8,
                      background: '#FEE2E2', color: '#B91C1C', fontWeight: 700 }}>
                      {L.youAns} {w.studentAnswer}
                    </span>
                    <span style={{ fontSize: 11, padding: '5px 12px', borderRadius: 8,
                      background: '#D1FAE5', color: '#065F46', fontWeight: 700 }}>
                      {L.correctAns} {w.correctAnswer}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: 12, color: C.sub, lineHeight: 1.6 }}>{w.explanation}</p>

                  {/* AI Teaching Section */}
                  <div style={{ marginTop: 12, padding: '12px', background: '#F8FAFC', borderRadius: 8, border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: C.primary }}>🤖 AI o'qituvchi</span>
                      <button
                        onClick={() => teachTopic(w.topic, w.questionNumber)}
                        disabled={loadingAI[w.questionNumber]}
                        style={{
                          padding: '6px 12px',
                          borderRadius: 6,
                          border: 'none',
                          background: loadingAI[w.questionNumber] ? '#E5E7EB' : C.primary,
                          color: loadingAI[w.questionNumber] ? '#6B7280' : '#fff',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: loadingAI[w.questionNumber] ? 'not-allowed' : 'pointer',
                          fontFamily: 'inherit'
                        }}
                      >
                        {loadingAI[w.questionNumber] ? '⏳ O\'qitilmoqda...' : '📚 Dars olish'}
                      </button>
                    </div>

                    {aiTeaching[w.questionNumber] && (
                      <div style={{ fontSize: 12, lineHeight: 1.6, color: C.text, padding: '8px', background: '#fff', borderRadius: 6, border: '1px solid #E2E8F0' }}>
                        {aiTeaching[w.questionNumber]}
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
            <Button onClick={onBack}>{L.backBtn}</Button>
          </>
        )}

        {!result.wrongAnswers?.length && (
          <Card style={{ textAlign: 'center', padding: '28px',
            background: '#F0FDF4', border: '1px solid #A7F3D0' }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🏆</div>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: C.success }}>{L.perfect}</h3>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: C.sub }}>{L.allCorrect}</p>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── Main export: orchestrates upload and result steps ────────────────────────
export default function AnalyzePage() {
  const { L, refreshHistory } = useApp();
  const [step,    setStep]    = useState('upload');
  const [result,  setResult]  = useState(null);
  const [preview, setPreview] = useState(null);

  const onAnalyzed = async (r, p) => {
    try {
      await addHistory(r);
      refreshHistory();
    } catch {
      // fallback: continue even if history save fails
    }
    setResult(r); setPreview(p); setStep('result');
  };

  if (step === 'upload') return <UploadStep onAnalyzed={onAnalyzed} L={L} />;
  if (step === 'result') return <ResultStep result={result} onBack={() => setStep('upload')} L={L} />;
  return null;
}
