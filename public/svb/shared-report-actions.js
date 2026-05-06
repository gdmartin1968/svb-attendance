window.SVBReportActions = window.SVBReportActions || {};

window.SVBReportActions.openEmailDraft = function ({ to, cc, subject, body }) {
  const encodedTo = encodeURIComponent(to || "");
  const encodedCc = encodeURIComponent(cc || "");
  const encodedSubject = encodeURIComponent(subject || "");
  const encodedBody = encodeURIComponent(body || "");

  const gmailComposeUrl =
    `https://mail.google.com/mail/?view=cm&fs=1` +
    `&to=${encodedTo}` +
    `&cc=${encodedCc}` +
    `&su=${encodedSubject}` +
    `&body=${encodedBody}`;

  const mailtoUrl =
    `mailto:${encodedTo}` +
    `?cc=${encodedCc}` +
    `&subject=${encodedSubject}` +
    `&body=${encodedBody}`;

  const isAndroid = /Android/i.test(navigator.userAgent);
  const isAppleMobile = /iPhone|iPad|iPod/i.test(navigator.userAgent);

  const gmailIntentUrl =
    `intent://compose?to=${encodedTo}` +
    `&cc=${encodedCc}` +
    `&subject=${encodedSubject}` +
    `&body=${encodedBody}` +
    `#Intent;scheme=mailto;package=com.google.android.gm;end`;

  if (isAndroid) {
    window.location.href = gmailIntentUrl;
  } else if (isAppleMobile) {
    window.location.href = mailtoUrl;
  } else {
    window.open(gmailComposeUrl, "_blank");
  }
};

window.SVBReportActions.openEmailDraftFromEncoded = function (encodedSubject, encodedBody) {
  window.SVBReportActions.openEmailDraft({
    to: "nwalton@svbtennisfoundation.org",
    cc: "kevin@svbtennisfoundation.org,classroom.connector@gmail.com",
    subject: decodeURIComponent(encodedSubject || ""),
    body: decodeURIComponent(encodedBody || ""),
  });
};
