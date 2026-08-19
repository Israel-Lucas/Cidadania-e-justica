const EMAIL_DESTINO = "traynorout@gmail.com";
const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxQVhebSayvN0QfVnCdkgEXPXTzFwVWb7tBfJUgkoCg9VrvRy1he_6UgE4HpvJd_sbk/exec";

const form = document.querySelector('#registration-form');
const statusMessage = document.querySelector('#status');
const button = form.querySelector('button');
const successModal = document.querySelector('#success-modal');
const closeModalButton = document.querySelector('#close-modal');
let closeModalTimer;

function closeModal() {
  clearTimeout(closeModalTimer);
  successModal.classList.remove('open');
  successModal.setAttribute('aria-hidden', 'true');
}

function openSuccessModal() {
  successModal.classList.add('open');
  successModal.setAttribute('aria-hidden', 'false');
  closeModalButton.focus();
  closeModalTimer = setTimeout(closeModal, 2000);
}

async function sendWithAppsScript(formData) {
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  });
}

async function sendWithFormSubmit(formData) {
  const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(EMAIL_DESTINO)}`, {
    method: 'POST',
    headers: { Accept: 'application/json' },
    body: formData
  });
  const result = await response.json().catch(() => ({}));

  if (!response.ok || result.success === false) {
    throw new Error(result.message || 'Falha ao enviar pelo FormSubmit.');
  }
}

closeModalButton.addEventListener('click', closeModal);
successModal.addEventListener('click', (event) => { if (event.target === successModal) closeModal(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeModal(); });

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  statusMessage.className = 'status';

  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  button.disabled = true;
  button.textContent = 'Enviando...';

  try {
    const formData = new FormData(form);

    if (APPS_SCRIPT_URL) {
      await sendWithAppsScript(formData);
    } else {
      await sendWithFormSubmit(formData);
    }

    form.reset();
    statusMessage.className = 'status success';
    statusMessage.textContent = 'Inscrição enviada com sucesso!';
    openSuccessModal();
  } catch (error) {
    const message = error.message || '';
    statusMessage.textContent = message.includes('confirm')
      ? 'Confirme o e-mail do FormSubmit na caixa de entrada ou spam e tente novamente.'
      : 'Não foi possível enviar agora. Verifique a configuração do envio e tente novamente.';
  } finally {
    button.disabled = false;
    button.textContent = 'Enviar inscrição';
  }
});
