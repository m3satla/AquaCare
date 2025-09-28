import React, { useState } from "react";
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper,
  Card,
  CardContent,
  Grid,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Chip,
  Divider,
  Fade,
  Zoom,
  Slide
} from "@mui/material";
import { 
  MdEmail, 
  MdPhone, 
  MdLocationOn, 
  MdAccessTime,
  MdSend,
  MdWhatsapp,
  MdCode,
  MdBusiness,
  MdSupport,
  MdSecurity,
  MdSpeed,
  MdUpdate,
  MdStar,
  MdTrendingUp,
  MdVerified
} from "react-icons/md";
import { FaWhatsapp, FaGithub, FaLinkedin, FaRocket, FaHeart } from "react-icons/fa";
import { useTranslation } from "../hooks/useTranslation";

const DeveloperContact: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError(t('developerContact.form.errorFillRequired'));
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Simulate sending email (in real app, this would send to backend)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
      });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error("❌ Error sending message:", err);
      setError(t('developerContact.form.errorFailedToSend'));
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: "📞",
      title: t('developerContact.contact.phone'),
      value: "+972-54-393-2324",
      link: "tel:+972543932324",
      color: "#2196F3"
    },
    {
      icon: "📧",
      title: t('developerContact.contact.email'),
      value: "liranbensimon18@gmail.com",
      link: "mailto:liranbensimon18@gmail.com",
      color: "#F44336"
    },
    {
      icon: "💬",
      title: t('developerContact.contact.whatsapp'),
      value: "+972-54-393-2324",
      link: "https://wa.me/972543932324",
      color: "#4CAF50"
    },
    {
      icon: "⏰",
      title: t('developerContact.contact.responseTime'),
      value: t('developerContact.contact.responseTimeValue'),
      color: "#FF9800"
    }
  ];

  const services = [
    {
      icon: "💻",
      title: t('developerContact.services.customDevelopment.title'),
      description: t('developerContact.services.customDevelopment.description'),
      color: "#9C27B0"
    },
    {
      icon: "🛠️",
      title: t('developerContact.services.technicalSupport.title'),
      description: t('developerContact.services.technicalSupport.description'),
      color: "#2196F3"
    },
    {
      icon: "🔒",
      title: t('developerContact.services.securityCompliance.title'),
      description: t('developerContact.services.securityCompliance.description'),
      color: "#4CAF50"
    },
    {
      icon: "⚡",
      title: t('developerContact.services.performanceOptimization.title'),
      description: t('developerContact.services.performanceOptimization.description'),
      color: "#FF9800"
    }
  ];

  const socialLinks = [
    {
      icon: "🐙",
      name: "GitHub",
      url: "https://github.com/m3satla/aqua-care",
      color: "#333",
      description: t('developerContact.social.githubDesc')
    },
    {
      icon: "💼",
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/liran-ben-simon-860134363/",
      color: "#0077B5",
      description: t('developerContact.social.linkedinDesc')
    }
  ];

  const stats = [
    { number: "5+", label: t('developerContact.stats.projects') },
    { number: "24/7", label: t('developerContact.stats.support') },
    { number: "100%", label: t('developerContact.stats.satisfaction') },
    { number: "2+", label: t('developerContact.stats.years') }
  ];

  return (
    <Box sx={{ 
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${theme.palette.primary.main}05 0%, ${theme.palette.secondary.main}05 100%)`,
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Background Decorative Elements */}
      <Box sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        height: "100%",
        background: `radial-gradient(circle at 20% 80%, ${theme.palette.primary.main}10 0%, transparent 50%),
                    radial-gradient(circle at 80% 20%, ${theme.palette.secondary.main}10 0%, transparent 50%)`,
        pointerEvents: "none"
      }} />

      <Container maxWidth="lg" sx={{ py: 6, position: "relative", zIndex: 1 }}>
        {/* Hero Section */}
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Box sx={{ 
              display: "inline-flex", 
              alignItems: "center", 
              mb: 3,
              p: 2,
              borderRadius: 3,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}15, ${theme.palette.secondary.main}15)`,
              border: `1px solid ${theme.palette.primary.main}30`
            }}>
              <FaRocket size={32} color={theme.palette.primary.main} />
              <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold", color: theme.palette.primary.main }}>
                {t('developerContact.heroBadge')}
              </Typography>
            </Box>
            
            <Typography 
              variant={isMobile ? "h3" : "h2"} 
              gutterBottom 
              sx={{ 
                fontWeight: "bold",
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
                textShadow: "0 4px 8px rgba(0,0,0,0.1)"
              }}
            >
              {t('developerContact.heroTitle')}
            </Typography>
            
            <Typography 
              variant="h5" 
              color="text.secondary"
              sx={{ 
                maxWidth: "800px", 
                mx: "auto",
                mb: 4,
                lineHeight: 1.6
              }}
            >
              {t('developerContact.heroSubtitle')}
            </Typography>

            {/* Stats Section */}
            <Box sx={{ 
              display: "grid", 
              gridTemplateColumns: { xs: "repeat(2, 1fr)", sm: "repeat(4, 1fr)" },
              gap: 3, 
              mt: 4, 
              maxWidth: "600px", 
              mx: "auto" 
            }}>
              {stats.map((stat, index) => (
                <Zoom in timeout={1000 + index * 200} key={index}>
                  <Card 
                    elevation={0}
                    sx={{ 
                      textAlign: "center",
                      p: 2,
                      background: "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      transition: "transform 0.3s ease",
                      "&:hover": { transform: "translateY(-8px)" }
                    }}
                  >
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {stat.number}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Card>
                </Zoom>
              ))}
            </Box>
          </Box>
        </Fade>

        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", md: "1fr 2fr" },
          gap: 4 
        }}>
          {/* Services Section */}
          <Box>
            <Slide direction="right" in timeout={1000}>
              <Card 
                elevation={0}
                sx={{ 
                  height: "fit-content",
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 3
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: "50%", 
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: "white",
                      mr: 2
                    }}>
                      <MdBusiness size={28} />
                    </Box>
                    <Typography variant="h5" fontWeight="bold">
                      {t('developerContact.whatICanDo')}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    {services.map((service, index) => (
                      <Fade in timeout={1000 + index * 200} key={index}>
                        <Box sx={{ 
                          p: 3, 
                          borderRadius: 3, 
                          background: "rgba(255,255,255,0.5)",
                          border: `1px solid ${service.color}20`,
                          transition: "all 0.3s ease",
                          "&:hover": { 
                            transform: "translateX(8px)",
                            boxShadow: `0 8px 25px ${service.color}20`
                          }
                        }}>
                          <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                            <Box sx={{ 
                              p: 1.5, 
                              borderRadius: "50%", 
                              bgcolor: service.color,
                              color: "white",
                              mr: 3,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.5rem"
                            }}>
                              {service.icon}
                            </Box>
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="h6" fontWeight="bold" gutterBottom>
                                {service.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {service.description}
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                      </Fade>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Slide>
          </Box>

          {/* Contact Form */}
          <Box>
            <Slide direction="left" in timeout={1000}>
              <Paper 
                elevation={0}
                sx={{ 
                  p: 5,
                  background: "rgba(255,255,255,0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 3
                }}
              >
                {success && (
                  <Fade in timeout={500}>
                    <Alert 
                      severity="success" 
                      sx={{ mb: 4 }}
                      action={
                        <Button color="inherit" size="small" onClick={() => setSuccess(false)}>
                          {t('developerContact.form.close')}
                        </Button>
                      }
                    >
                      {t('developerContact.form.success')}
                    </Alert>
                  </Fade>
                )}

                {error && (
                  <Fade in timeout={500}>
                    <Alert 
                      severity="error" 
                      sx={{ mb: 4 }}
                      action={
                        <Button color="inherit" size="small" onClick={() => setError(null)}>
                          {t('developerContact.form.close')}
                        </Button>
                      }
                    >
                      {error}
                    </Alert>
                  </Fade>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
                    <Box sx={{ 
                      p: 2, 
                      borderRadius: "50%", 
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: "white",
                      mr: 3
                    }}>
                      <MdSend size={28} />
                    </Box>
                    <Typography variant="h4" fontWeight="bold">
                      {t('developerContact.form.heading')}
                    </Typography>
                  </Box>

                  <Box sx={{ 
                    display: "grid", 
                    gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                    gap: 3 
                  }}>
                    <Box>
                      <TextField
                        fullWidth
                        label={t('developerContact.form.nameLabel')}
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }}
                      />
                    </Box>
                    <Box>
                      <TextField
                        fullWidth
                        label={t('developerContact.form.emailLabel')}
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                      <TextField
                        fullWidth
                        label={t('developerContact.form.companyLabel')}
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                      <TextField
                        fullWidth
                        label={t('developerContact.form.subjectLabel')}
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }}
                      />
                    </Box>
                    <Box sx={{ gridColumn: { xs: "1", sm: "1 / -1" } }}>
                      <TextField
                        fullWidth
                        label={t('developerContact.form.messageLabel')}
                        name="message"
                        multiline
                        rows={6}
                        variant="outlined"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder={t('developerContact.form.messagePlaceholder')}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            "&:hover fieldset": {
                              borderColor: theme.palette.primary.main,
                            },
                          }
                        }}
                      />
                    </Box>
                  </Box>

                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth
                    disabled={isLoading}
                    size="large"
                    startIcon={isLoading ? <CircularProgress size={20} /> : <MdSend />}
                    sx={{ 
                      mt: 4,
                      py: 2,
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      borderRadius: 3,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                      boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                      "&:hover": {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                        boxShadow: `0 12px 35px ${theme.palette.primary.main}60`,
                        transform: "translateY(-2px)"
                      },
                      transition: "all 0.3s ease"
                    }}
                  >
                    {isLoading 
                      ? t('developerContact.form.sending')
                      : t('developerContact.form.submit')
                    }
                  </Button>
                </Box>
              </Paper>
            </Slide>
          </Box>
        </Box>

        {/* Contact Information */}
        <Fade in timeout={1500}>
          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mb: 6, fontWeight: "bold" }}>
              {t('developerContact.contact.heading')}
            </Typography>
            
            <Box sx={{ 
              display: "flex", 
              flexWrap: "wrap", 
              gap: 3,
              justifyContent: "center"
            }}>
              {contactInfo.map((info, index) => (
                <Box key={index} sx={{ 
                  flex: { xs: "1 1 100%", sm: "1 1 calc(50% - 12px)", md: "1 1 calc(25% - 18px)" },
                  minWidth: { xs: "100%", sm: "250px", md: "200px" }
                }}>
                  <Zoom in timeout={1000 + index * 200}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        textAlign: "center",
                        p: 4,
                        height: "100%",
                        background: "rgba(255,255,255,0.8)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        borderRadius: 3,
                        transition: "all 0.3s ease",
                        "&:hover": { 
                          transform: "translateY(-12px)",
                          boxShadow: `0 20px 40px ${info.color}20`
                        }
                      }}
                    >
                      <Box sx={{ 
                        p: 3, 
                        borderRadius: "50%", 
                        bgcolor: info.color,
                        color: "white",
                        mx: "auto",
                        mb: 3,
                        width: "fit-content",
                        boxShadow: `0 8px 25px ${info.color}40`,
                        fontSize: "2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        {info.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {info.title}
                      </Typography>
                      {info.link ? (
                        <Typography 
                          component="a" 
                          href={info.link}
                          variant="body1" 
                          sx={{ 
                            fontWeight: "bold",
                            color: info.color,
                            textDecoration: "none",
                            "&:hover": { textDecoration: "underline" }
                          }}
                        >
                          {info.value}
                        </Typography>
                      ) : (
                        <Typography variant="body1" fontWeight="bold" color="text.primary">
                          {info.value}
                        </Typography>
                      )}
                    </Card>
                  </Zoom>
                </Box>
              ))}
            </Box>
          </Box>
        </Fade>

        {/* Social Links */}
        <Fade in timeout={2000}>
          <Box sx={{ mt: 8, textAlign: "center" }}>
            <Box sx={{ 
              display: "inline-flex", 
              alignItems: "center", 
              mb: 4,
              p: 2,
              borderRadius: 3,
              background: "rgba(255,255,255,0.8)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.2)"
            }}>
              <FaHeart size={24} color={theme.palette.error.main} />
              <Typography variant="h5" sx={{ ml: 2, fontWeight: "bold" }}>
                {t('developerContact.social.heading')}
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
              {socialLinks.map((social, index) => (
                <Zoom in timeout={2000 + index * 300} key={index}>
                  <Card
                    elevation={0}
                    component="a"
                    href={social.url}
                    target="_blank"
                    sx={{ 
                      p: 3,
                      borderRadius: 3,
                      background: "rgba(255,255,255,0.8)",
                      backdropFilter: "blur(10px)",
                      border: `2px solid ${social.color}`,
                      textDecoration: "none",
                      transition: "all 0.3s ease",
                      "&:hover": { 
                        transform: "translateY(-8px) scale(1.05)",
                        boxShadow: `0 20px 40px ${social.color}30`
                      }
                    }}
                  >
                    <Box sx={{ textAlign: "center" }}>
                      <Box sx={{ 
                        p: 2, 
                        borderRadius: "50%", 
                        bgcolor: social.color,
                        color: "white",
                        mx: "auto",
                        mb: 2,
                        width: "fit-content",
                        fontSize: "2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}>
                        {social.icon}
                      </Box>
                      <Typography variant="h6" fontWeight="bold" color="text.primary">
                        {social.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {social.description}
                      </Typography>
                    </Box>
                  </Card>
                </Zoom>
              ))}
            </Box>
          </Box>
        </Fade>

        {/* Call to Action */}
        <Fade in timeout={2500}>
          <Box sx={{ 
            mt: 8, 
            textAlign: "center",
            p: 6,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.secondary.main}10)`,
            border: `1px solid ${theme.palette.primary.main}20`
          }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {t('developerContact.cta.title')}
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
              {t('developerContact.cta.subtitle')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<MdTrendingUp />}
              sx={{
                px: 6,
                py: 2,
                fontSize: "1.2rem",
                fontWeight: "bold",
                borderRadius: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: `0 8px 25px ${theme.palette.primary.main}40`,
                "&:hover": {
                  background: `linear-gradient(45deg, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
                  boxShadow: `0 12px 35px ${theme.palette.secondary.main}40`,
                  transform: "translateY(-2px)"
                },
                transition: "all 0.3s ease"
              }}
            >
              {t('developerContact.cta.button')}
            </Button>
          </Box>
        </Fade>
      </Container>
    </Box>
  );
};

export default DeveloperContact;
