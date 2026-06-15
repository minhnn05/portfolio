from __future__ import annotations
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from app.config.settings import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

def _build_notification_html(name: str, email: str, subject: str, body: str) -> str:
    return f"""
    <html><body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
      <div style="background: #1e1e2e; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #cdd6f4; margin: 0;">📬 Tin nhắn mới từ Portfolio</h2>
      </div>
      <div style="padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 120px; color: #666;">Người gửi:</td>
            <td style="padding: 8px 0;">{name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:{email}" style="color: #89b4fa;">{email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #666;">Chủ đề:</td>
            <td style="padding: 8px 0;">{subject}</td>
          </tr>
        </table>
        <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;">
        <p style="font-weight: bold; color: #666; margin-bottom: 8px;">Nội dung:</p>
        <div style="background: #f5f5f5; padding: 16px; border-radius: 6px; white-space: pre-wrap;">{body}</div>
      </div>
    </body></html>
    """


def _build_auto_reply_html(name: str) -> str:
    return f"""
    <html><body style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
      <div style="background: #1e1e2e; padding: 24px; border-radius: 8px 8px 0 0;">
        <h2 style="color: #cdd6f4; margin: 0;">Cảm ơn bạn đã liên hệ!</h2>
      </div>
      <div style="padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
        <p>Xin chào <strong>{name}</strong>,</p>
        <p>Tôi đã nhận được tin nhắn của bạn và sẽ phản hồi trong thời gian sớm nhất (thường trong vòng 24–48 giờ).</p>
        <p>Trân trọng,<br><strong>Minh</strong></p>
      </div>
    </body></html>
    """

def _send_email(to: str, subject: str, html: str) -> None:
    if not settings.MAIL_USERNAME or not settings.MAIL_PASSWORD:
        logger.warning("Email credentials chưa cấu hình — bỏ qua gửi email")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = settings.MAIL_FROM or settings.MAIL_USERNAME
    msg["To"] = to
    msg.attach(MIMEText(html, "html", "utf-8"))

    with smtplib.SMTP(settings.MAIL_SERVER, settings.MAIL_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(settings.MAIL_USERNAME, settings.MAIL_PASSWORD)
        server.sendmail(msg["From"], to, msg.as_string())


async def notify_new_message(
    name: str,
    email: str,
    subject: str,
    body: str,
) -> None:
    admin_email = settings.ADMIN_EMAIL

    # 1. Notify admin
    try:
        html = _build_notification_html(name, email, subject, body)
        _send_email(
            to=admin_email,
            subject=f"[Portfolio] Tin nhắn mới từ {name}: {subject}",
            html=html,
        )
        logger.info(f"✅ Đã gửi notification email tới admin ({admin_email})")
    except Exception as exc:
        logger.error(f"❌ Gửi notification email thất bại: {exc}")

    # 2. Auto-reply cho người gửi
    try:
        html = _build_auto_reply_html(name)
        _send_email(
            to=email,
            subject="Cảm ơn bạn đã liên hệ!",
            html=html,
        )
        logger.info(f"✅ Đã gửi auto-reply tới {email}")
    except Exception as exc:
        logger.error(f"❌ Gửi auto-reply thất bại: {exc}")