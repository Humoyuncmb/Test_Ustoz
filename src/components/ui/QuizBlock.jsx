import { useState } from 'react';
import { C } from '../../assets/theme';

export default function QuizBlock({ quiz }) {
  const [sel, setSel] = useState(null);
  if (!quiz?.options?.length) return null;

  return (
    <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(99,102,241,0.15)' }}>
      <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: C.pl }}>❓ Mini-test:</p>
      <p style={{ margin: '0 0 10px', fontSize: 12.5, color: C.text, lineHeight: 1.5 }}>{quiz.question}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        {quiz.options.map((opt, i) => {
          const LBL = ['A','B','C','D'][i];
          let bg = '#F8FAFF', bd = `1.5px solid ${C.border}`, cl = C.text;
          if (sel !== null) {
            if (i === quiz.correct) { bg = '#D1FAE5'; bd = '1.5px solid #10B981'; cl = '#065F46'; }
            else if (i === sel)     { bg = '#FEE2E2'; bd = '1.5px solid #EF4444'; cl = '#7F1D1D'; }
          }
          return (
            <button key={i} onClick={() => sel === null && setSel(i)}
              style={{ padding: '8px 11px', borderRadius: 9, background: bg, border: bd, color: cl,
                fontSize: 12, fontWeight: 600, cursor: sel === null ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', gap: 7, textAlign: 'left',
                width: '100%', fontFamily: 'inherit' }}>
              <span style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(0,0,0,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{LBL}</span>
              {opt}
            </button>
          );
        })}
      </div>
      {sel !== null && (
        <div style={{ margin: '8px 0 0', fontSize: 11.5, fontWeight: 600, padding: '8px 12px',
          borderRadius: 9,
          background: sel === quiz.correct ? '#D1FAE5' : '#FEE2E2',
          color:      sel === quiz.correct ? '#065F46' : '#7F1D1D' }}>
          {sel === quiz.correct
            ? "✅ To'g'ri! Zo'r!"
            : `❌ To'g'ri: ${['A','B','C','D'][quiz.correct]}) ${quiz.options[quiz.correct]}`}
        </div>
      )}
    </div>
  );
}
