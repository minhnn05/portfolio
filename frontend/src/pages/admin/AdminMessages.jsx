import { useEffect, useState } from 'react';
import { Star, Trash2, Mail, MailOpen, Archive, Check } from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { messageService } from '../../services/messageService';
import { formatDate } from '../../utils/formatDate';

const STATUS_BADGE = {
  unread:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
  read:     'bg-zinc-700 text-zinc-300 border-zinc-600',
  replied:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  archived: 'bg-zinc-800 text-zinc-500 border-zinc-700',
  spam:     'bg-red-500/10 text-red-400 border-red-500/20',
};

function MessageDetail({ msg, onClose, onUpdate }) {
  const [replyNote, setReplyNote] = useState(msg.reply_note ?? '');
  const [saving, setSaving] = useState(false);

  const handleStatus = async (status) => {
    await messageService.updateStatus(msg.id, status);
    onUpdate();
  };

  const handleStar = async () => {
    await messageService.toggleStar(msg.id, !msg.is_starred);
    onUpdate();
  };

  const handleSaveReply = async () => {
    setSaving(true);
    await messageService.saveReply(msg.id, replyNote);
    setSaving(false); onUpdate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-zinc-900 rounded-xl border border-zinc-800 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-base font-semibold text-white">{msg.subject}</h2>
            <p className="text-sm text-zinc-400 mt-0.5">{msg.name} · <a href={`mailto:${msg.email}`} className="hover:text-white">{msg.email}</a></p>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-500 hover:text-white text-xl leading-none ml-4">×</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Body */}
          <div className="bg-zinc-800/50 rounded-lg p-4 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
            {msg.body}
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
            {msg.company && <span>🏢 {msg.company}</span>}
            {msg.phone && <span>📱 {msg.phone}</span>}
            <span>📅 {formatDate(msg.created_at)}</span>
            {msg.ip_address && <span>🌐 {msg.ip_address}</span>}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <button onClick={handleStar}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${msg.is_starred ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'border-zinc-700 text-zinc-400 hover:text-amber-400'}`}>
              <Star size={12} className={msg.is_starred ? 'fill-amber-400' : ''} />
              {msg.is_starred ? 'Starred' : 'Star'}
            </button>
            <button onClick={() => handleStatus('replied')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-zinc-700 text-zinc-400 hover:text-emerald-400 transition-colors">
              <Check size={12} /> Mark Replied
            </button>
            <button onClick={() => handleStatus('archived')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-zinc-700 text-zinc-400 hover:text-zinc-300 transition-colors">
              <Archive size={12} /> Archive
            </button>
            <button onClick={() => handleStatus('spam')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border border-zinc-700 text-zinc-400 hover:text-red-400 transition-colors">
              Spam
            </button>
          </div>

          {/* Reply note */}
          <div>
            <label className="block text-xs text-zinc-400 mb-1.5">Ghi chú reply (nội bộ)</label>
            <textarea value={replyNote} onChange={(e) => setReplyNote(e.target.value)} rows={3}
              className="w-full px-3 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-violet-500 resize-none" />
            <button onClick={handleSaveReply} disabled={saving}
              className="mt-2 px-4 py-1.5 rounded-lg text-xs bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white transition-colors">
              {saving ? 'Lưu...' : 'Lưu ghi chú'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminMessages() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState(null);
  const [starredOnly, setStarredOnly] = useState(false);
  const [selectedMsg, setSelectedMsg] = useState(null);

  const load = () => {
    setIsLoading(true);
    messageService.adminGetAll({
      page, page_size: 20,
      ...(statusFilter ? { status: statusFilter } : {}),
      ...(starredOnly ? { starred: true } : {}),
    }).then(setData).catch(console.error).finally(() => setIsLoading(false));
  };

  useEffect(load, [page, statusFilter, starredOnly]);

  const openMsg = async (msg) => {
    const detail = await messageService.adminGetById(msg.id);
    setSelectedMsg(detail);
  };

  const handleDelete = async (msg) => {
    if (!confirm('Xóa tin nhắn này?')) return;
    await messageService.delete(msg.id);
    load();
  };

  const STATUSES = [null, 'unread', 'read', 'replied', 'archived', 'spam'];

  return (
    <div className="flex min-h-screen bg-zinc-950">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Messages</h1>
            {data?.unread_count > 0 && (
              <p className="text-sm text-blue-400 mt-0.5">{data.unread_count} chưa đọc</p>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm text-zinc-400 cursor-pointer">
            <input type="checkbox" checked={starredOnly} onChange={(e) => { setStarredOnly(e.target.checked); setPage(1); }} className="rounded" />
            Starred only
          </label>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUSES.map((s) => (
            <button key={s ?? 'all'} type="button" onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${statusFilter === s ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'}`}>
              {s ?? 'All'}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex justify-center py-24"><LoadingSpinner size="lg" /></div>
        ) : (
          <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
            <table className="w-full">
              <thead className="border-b border-zinc-800 bg-zinc-800/50">
                <tr>
                  {['From', 'Subject', 'Status', 'Date', ''].map((h, i) => (
                    <th key={i} className="py-3 px-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.items?.map((msg) => (
                  <tr key={msg.id}
                    className={`border-b border-zinc-800 hover:bg-zinc-800/30 transition-colors cursor-pointer ${msg.status === 'unread' ? 'bg-blue-500/5' : ''}`}
                    onClick={() => openMsg(msg)}
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {msg.is_starred && <Star size={12} className="text-amber-400 fill-amber-400 flex-shrink-0" />}
                        <div>
                          <div className={`text-sm ${msg.status === 'unread' ? 'font-semibold text-white' : 'text-zinc-300'}`}>{msg.name}</div>
                          <div className="text-xs text-zinc-500">{msg.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-zinc-300 max-w-xs">
                      <div className="truncate">{msg.subject}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_BADGE[msg.status] ?? ''}`}>
                        {msg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-xs text-zinc-500">{formatDate(msg.created_at)}</td>
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <button type="button" onClick={() => handleDelete(msg)}
                        className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data?.items?.length && <p className="text-center text-zinc-500 py-12 text-sm">Không có tin nhắn nào.</p>}
          </div>
        )}

        {data?.total_pages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="px-4 py-2 rounded-lg text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40">Trước</button>
            <span className="text-sm text-zinc-400 self-center">{page} / {data.total_pages}</span>
            <button onClick={() => setPage((p) => Math.min(data.total_pages, p + 1))} disabled={page === data.total_pages}
              className="px-4 py-2 rounded-lg text-sm bg-zinc-800 text-zinc-300 hover:bg-zinc-700 disabled:opacity-40">Sau</button>
          </div>
        )}

        {selectedMsg && (
          <MessageDetail msg={selectedMsg} onClose={() => setSelectedMsg(null)} onUpdate={() => { load(); setSelectedMsg(null); }} />
        )}
      </div>
    </div>
  );
}
