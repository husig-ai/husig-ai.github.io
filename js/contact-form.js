// Replace with your Supabase credentials
const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

// Only create client if it doesn't exist
if (typeof window.supabaseClient === 'undefined') {
  window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('contact-form');
  const messageDiv = document.getElementById('form-message');
  
  if (!form) return; // Exit if form doesn't exist on this page
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    const formData = {
      name: document.getElementById('contact-name').value.trim(),
      email: document.getElementById('contact-email').value.trim(),
      message: document.getElementById('contact-message').value.trim()
    };
    
    try {
      const { data, error } = await window.supabaseClient
        .from('contact_submissions')
        .insert([formData]);
      
      if (error) throw error;
      console.log('Form submission successful:', data);
      
      messageDiv.style.color = '#C062F2'; // green
      messageDiv.textContent = 'Thank you! Your message has been sent successfully. Our team will get back to you shortly.';
      form.reset();
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        messageDiv.textContent = '';
      }, 5000);
      
    } catch (error) {
      messageDiv.style.color = '#ef4444'; // red
      messageDiv.textContent = 'Error submitting form. Please try again or email us directly.';
      console.error('Error submitting form:', error);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  });
});