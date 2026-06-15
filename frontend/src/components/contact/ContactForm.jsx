import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { messageService } from '../../services/messageService';
import { cn } from '../../utils/cn';

const initialState = { name: '', email: '', company: '', subject: '', body: '' };

function Field({ label, id, required, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-300 mb-1.5">
        {label}{required && <span className="text-violet-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

const inputClass =
  'w-full px-4 py-2.5 rounded-lg bg-zinc-800 border border-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-colors text-sm';

export default function ContactForm() {
  const [form, setForm] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [serverError, setServerError] = useState('');

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Vui lòng nhập họ tên';
    if (!form.email.trim()) e.email = 'Vui lòng nhập email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email không hợp lệ';
    if (!form.subject.trim()) e.subject = 'Vui lòng nhập tiêu đề';
    if (form.body.trim().length < 10) e.body = 'Nội dung tối thiểu 10 ký tự';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('loading');
    try {
      await messageService.send(form);
      setStatus('success');
      setForm(initialState);
    } catch (err) {
      setServerError(err.response?.data?.detail ?? 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle size={48} className="text-emerald-400 mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Đã gửi thành công!</h3>
        <p className="text-zinc-400 mb-6">Tôi sẽ phản hồi trong vòng 24–48 giờ.</p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
        >
          Gửi tin nhắn khác
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Họ tên" id="name" required error={errors.name}>
          <input
            id="name" type="text" value={form.name} onChange={set('name')}
            placeholder="Nguyễn Văn A" autoComplete="name"
            className={cn(inputClass, errors.name && 'border-red-500')}
          />
        </Field>
        <Field label="Email" id="email" required error={errors.email}>
          <input
            id="email" type="email" value={form.email} onChange={set('email')}
            placeholder="email@example.com" autoComplete="email"
            className={cn(inputClass, errors.email && 'border-red-500')}
          />
        </Field>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Công ty" id="company" error={errors.company}>
          <input
            id="company" type="text" value={form.company} onChange={set('company')}
            placeholder="Tên công ty (tùy chọn)" autoComplete="organization"
            className={inputClass}
          />
        </Field>
        <Field label="Tiêu đề" id="subject" required error={errors.subject}>
          <input
            id="subject" type="text" value={form.subject} onChange={set('subject')}
            placeholder="Chủ đề liên hệ"
            className={cn(inputClass, errors.subject && 'border-red-500')}
          />
        </Field>
      </div>

      <Field label="Nội dung" id="body" required error={errors.body}>
        <textarea
          id="body" rows={6} value={form.body} onChange={set('body')}
          placeholder="Nội dung tin nhắn của bạn..."
          className={cn(inputClass, 'resize-none', errors.body && 'border-red-500')}
        />
      </Field>

      {status === 'error' && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium transition-colors"
      >
        {status === 'loading' ? (
          <>Đang gửi...</>
        ) : (
          <><Send size={16} /> Gửi tin nhắn</>
        )}
      </button>
    </form>
  );
}
